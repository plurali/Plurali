import { $db } from '../../../../services/db/index.js';
import { controller } from '../../../../utils/server.js';
import { withSystemContext } from '../../../contexts/system.js';
import { data, error, Status } from '../../../status.js';
import { systemBaseDataSchema, SystemBaseDataSchema, idSchema, IdSchema } from '../../../../utils/server.js';
import { Background } from '@plurali/common/dist/data/index.js';
import { $storage, S3Prefix } from '../../../../services/s3/index.js';
import { fileTypeFromBuffer } from 'file-type';

export default controller(async server => {
  server.get('/', async (req, res) =>
    withSystemContext({ req, res }, async ({ getSystemMembers }) =>
      res.send(data({ members: await getSystemMembers() }))
    )
  );

  server.get<IdSchema>('/:id', { schema: idSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ getSystemMember }) => {
      const member = await getSystemMember(req.params.id);
      if (!member) {
        return res.status(400).send(error(Status.ResourceNotFound));
      }

      res.send(data({ member }));
    })
  );

  server.post<SystemBaseDataSchema>('/:id', { schema: systemBaseDataSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ system, getSystemMember, user }) => {
      const member = await $db.userMember.findFirst({
        where: {
          pluralId: req.params.id,
          pluralOwnerId: system.id,
        },
      });

      if (!member) {
        return res.status(400).send(error(Status.ResourceNotFound));
      }

      await $db.userMember.update({
        where: { id: member.id },
        data: {
          ...(typeof req.body.visible === 'boolean' ? { visible: req.body.visible } : {}),
          ...(req.body.customDescription?.trim().length >= 1 ? { customDescription: req.body.customDescription } : {}),
          ...(req.body.backgroundColor
            ? { backgroundColor: req.body.backgroundColor, backgroundType: Background.Color }
            : {}),
        },
      });

      res.send(data({ member: await getSystemMember(req.params.id) }));
    })
  );

  server.post<IdSchema>('/:id/background', { schema: idSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ system, getSystemMember, user }) => {
      if (!req.isMultipart()) {
        return res.status(400).send(error(Status.MultipartEndpoint));
      }

      let member = await $db.userMember.findFirst({
        where: {
          pluralId: req.params.id,
          pluralOwnerId: system.id,
        },
      });

      if (!member) {
        return res.status(400).send(error(Status.ResourceNotFound));
      }

      const file = await req.file();
      const buf = await file.toBuffer();
      const fileType = await fileTypeFromBuffer(buf);

      if (!fileType || !fileType.mime.startsWith('image/')) {
        return res.status(400).send(error(Status.UnsupportedFile));
      }

      const key = `${S3Prefix.Userdata}/${user.id}/${system.id}/${member.pluralId}/background.${fileType.ext}`;

      const result = await $storage.store(key, buf, true);

      if (!result.ok) {
        return res.status(400).send(error(Status.FileProcessingFailed));
      }

      member = await $db.userMember.update({
        where: {
          id: member.id,
        },
        data: {
          backgroundType: Background.Image,
          backgroundImage: key,
          lastTimeAssetChanged: new Date()
        },
      });

      return res.send(
        data({ member: await getSystemMember(req.params.id), ...(result ? { warning: Status.CacheDemand } : {}) })
      );
    })
  );
}, '/system/members');
