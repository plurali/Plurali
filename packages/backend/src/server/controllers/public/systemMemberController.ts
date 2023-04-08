import { controller } from "../../../utils/server"
import { data, error, Status } from '../../status'
import S from 'fluent-json-schema'
import { withPublicUserContext } from '../../contexts/publicUser'
import { idSchema, IdSchema } from '../../../utils/server'

export interface MemberIdSchema {
  Params: IdSchema['Params'] & {
    memberId: string
  }
}
export const memberIdSchema = S.object().prop(
  'params',
  S.object().prop('id', S.string().required()).prop('memberId', S.string().required())
)

export default controller(async server => {
  server.get<IdSchema>('/', { schema: idSchema.valueOf() }, async (req, res) =>
    withPublicUserContext({ req, res }, async ({ getSystemMembers }) => {
      res.send(data({ members: await getSystemMembers() }))
    })
  )

  server.get<MemberIdSchema>('/:memberId', { schema: memberIdSchema.valueOf() }, async (req, res) =>
    withPublicUserContext({ req, res }, async ({ getSystemMember }) => {
      const member = await getSystemMember(req.params.memberId)
      if (!member) {
        return res.status(400).send(error(Status.ResourceNotFound))
      }
      res.send(data({ member }))
    })
  )
}, '/public/system/:id/members')
