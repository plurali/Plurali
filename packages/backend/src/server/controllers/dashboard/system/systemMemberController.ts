import { $db } from '../../../../services/db'
import { controller } from '../../../../utils/server'
import { withSystemContext } from '../../../contexts/system'
import { data, error, Status } from '../../../status'
import { systemBaseDataSchema, SystemBaseDataSchema, idSchema, IdSchema } from '../../../../utils/server'

export default controller(async server => {
  server.get('/members', async (req, res) =>
    withSystemContext({ req, res }, async ({ getSystemMembers }) =>
      res.send(data({ members: await getSystemMembers() }))
    )
  )

  server.get<IdSchema>('/members/:id', { schema: idSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ getSystemMember }) => {
      const member = await getSystemMember(req.params.id)
      if (!member) {
        return res.status(400).send(error(Status.ResourceNotFound))
      }

      res.send(data({ member }))
    })
  )

  server.post<SystemBaseDataSchema>('/members/:id', { schema: systemBaseDataSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ system, getSystemMember }) => {
      const member = await $db.userMember.findFirst({
        where: {
          pluralId: req.params.id,
          pluralOwnerId: system.id,
        },
      })

      if (!member) {
        return res.status(400).send(error(Status.ResourceNotFound))
      }

      await $db.userMember.update({
        where: { id: member.id },
        data: {
          ...(typeof req.body.visible === 'boolean' ? { visible: req.body.visible } : {}),
          ...(req.body.description?.trim().length >= 1 ? { visible: req.body.visible } : {}),
        },
      })

      res.send(data({ member: await getSystemMember(req.params.id) }))
    })
  )
})
