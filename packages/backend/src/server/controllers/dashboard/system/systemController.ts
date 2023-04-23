import {
  controller,
  idSchema,
  IdSchema,
  systemBaseDataSchema,
  SystemBaseDataSchema,
} from '../../../../utils/server.js';
import { data, error, Status } from '../../../status.js';
import { withSystemContext } from '../../../contexts/system.js';
import { $db } from '../../../../services/db/index.js';
import { fetchMe } from '../../../../plural/users.js';
import { fileTypeFromBuffer } from 'file-type';
import { $storage, S3Prefix } from '../../../../services/s3/index.js';
import { Background } from '@prisma/client';

export default controller(async server => {
  server.get('/', async (req, res) => withSystemContext({ req, res }, ({ system }) => res.send(data({ system }))));

  server.post<SystemBaseDataSchema>('/', { schema: systemBaseDataSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ user }) => {
      user = await $db.user.update({
        where: { id: user.id },
        data: {
          ...(typeof req.body.visible === 'boolean' ? { visible: req.body.visible } : {}),
          ...(req.body.customDescription?.trim().length >= 1 ? { customDescription: req.body.customDescription } : {}),
          ...(req.body.backgroundColor
            ? { backgroundColor: req.body.backgroundColor, backgroundType: Background.Color }
            : {}),
        },
      });

      res.send(data({ system: await fetchMe({ user }) }));
    })
  );

  server.post<IdSchema>('/background', { schema: idSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ system, user }) => {
      if (!req.isMultipart()) {
        return res.status(400).send(error(Status.MultipartEndpoint));
      }
      const file = (await req.file());
      const buf = await file.toBuffer();
      const fileType = await fileTypeFromBuffer(buf);

      if (!fileType || !fileType.mime.startsWith('image/')) {
        return res.status(400).send(error(Status.UnsupportedFile));
      }

      const key = `${S3Prefix.Userdata}/${user.id}/${system.id}/background.${fileType.ext}`;

      const success = await $storage.store(key, buf);
      if (!success) {
        return res.status(400).send(error(Status.FileProcessingFailed));
      }

      // validate image is indeed on S3
      const image = await $storage.get(key);
      if (!image) {
        return res.status(400).send(error(Status.FileProcessingFailed));
      }

      user = await $db.user.update({
        where: {
          id: user.id,
        },
        data: {
          backgroundType: Background.Image,
          backgroundImage: key,
        },
      });

      return res.send(data({ system: await fetchMe({ user }) }));
    })
  );
}, '/system');
