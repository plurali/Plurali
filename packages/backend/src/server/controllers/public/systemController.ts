import { controller, idSchema, IdSchema } from '../../../utils/server'
import { data, error, Status } from '../../status'
import { withPublicUserContext } from '../../contexts/publicUser'

export default controller(async server => {
  server.get<IdSchema>('/:id', { schema: idSchema.valueOf() }, async (req, res) =>
    withPublicUserContext({ req, res }, async ({ system }) => res.send(data({ system })))
  )
}, '/public/system')
