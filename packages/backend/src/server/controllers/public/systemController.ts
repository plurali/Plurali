import { controller, idSchema, IdSchema } from '../../../utils/server.js'
import { data } from '../../status.js'
import { withPublicUserContext } from '../../contexts/publicUser.js'

export default controller(async server => {
  server.get<IdSchema>('/:id', { schema: idSchema.valueOf() }, async (req, res) =>
    withPublicUserContext({ req, res }, async ({ system }) => res.send(data({ system })))
  )
}, '/public/system')
