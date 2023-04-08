import { controller, systemBaseDataSchema, SystemBaseDataSchema } from '../../../../utils/server'
import { data } from '../../../status'
import { withSystemContext } from '../../../contexts/system'
import { $db } from '../../../../services/db'
import { fetchMe } from '../../../../plural'

export default controller(async server => {
  server.get('/', async (req, res) => withSystemContext({ req, res }, ({ system }) => res.send(data({ system }))))

  server.post<SystemBaseDataSchema>('/', { schema: systemBaseDataSchema.valueOf() }, async (req, res) =>
    withSystemContext({ req, res }, async ({ user }) => {
      user = await $db.user.update({
        where: { id: user.id },
        data: {
          ...(typeof req.body.visible === 'boolean' ? { visible: req.body.visible } : {}),
          ...(req.body.description?.trim().length >= 1 ? { visible: req.body.visible } : {}),
        },
      })

      res.send(data({ system: await fetchMe({ user }) }))
    })
  )
}, '/system')
