import { transformMemberField } from '../../../../plural/index.js'
import { $db } from '../../../../services/db/index.js'
import { controller, systemBaseDataSchema, SystemBaseDataSchema } from '../../../../utils/server.js'
import { withSystemContext } from '../../../contexts/system.js'
import { data, error, Status } from '../../../status.js'

export default controller(async server => {
  server.get('/', async (req, res) =>
    withSystemContext({ req, res }, async ({ system }) => res.send(data({ fields: system.fields })))
  )

  server.post<SystemBaseDataSchema>('/:id', { schema: systemBaseDataSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ system }) => {
      let field = await $db.userField.findFirst({
        where: {
          pluralId: req.params.id,
          pluralOwnerId: system.id,
        },
      })

      if (!field) {
        return res.status(400).send(error(Status.ResourceNotFound))
      }

      field = await $db.userField.update({
        where: { id: field.id },
        data: {
          ...(typeof req.body.visible === 'boolean' ? { visible: req.body.visible } : {}),
          ...(req.body.customDescription?.trim().length >= 1 ? { customDescription: req.body.customDescription } : {}),
        },
      })

      res.send(data({ field: transformMemberField(field.pluralId, system, field) }))
    })
  )
}, '/system/fields')
