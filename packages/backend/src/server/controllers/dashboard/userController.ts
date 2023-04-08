import { UserDto } from '@plurali/common/dist/dto'
import { getUser, testKey } from '@plurali/common/dist/plural'
import { Prisma } from '@prisma/client'
import S from 'fluent-json-schema'
import { syncWithApi } from '../../../plural'
import { $db } from '../../../services/db'
import { withUserContext } from '../../contexts/user'
import { controller } from '../../../utils/server'
import { data, error, Status } from '../../status'

export const userUpdateSchema = S.object().prop(
  'body',
  S.object()
    .prop('pluralKey', S.string().minLength(32).default(null))
    .prop('overridePluralId', S.string().minLength(1).default(null))
)

export interface UserUpdateSchema {
  Body: {
    pluralKey?: string
    overridePluralId?: string
  }
}

export default controller(async server => {
  server.get('/', async (req, res) =>
    withUserContext({ req, res }, ({ user }) => res.send(data({ user: UserDto.from(user) })))
  )

  server.post<UserUpdateSchema>('/', { schema: userUpdateSchema.valueOf() }, async (req, res) =>
    withUserContext({ req, res }, async ({ user }) => {
      const input: Prisma.UserUpdateInput = {}

      // Plural token
      if (req.body.pluralKey) {
        if (!(await testKey(req.body.pluralKey))) {
          return res.status(400).send(error(Status.InvalidPluralKey))
        }
        input.pluralKey = req.body.pluralKey
      } else {
        input.pluralKey = null
      }

      // dev: disguise your own plural user id, however the pluralKey must have access
      // (eg. friends)
      if (req.body.overridePluralId) {
        if (!user.admin) {
          return res.status(400).send(error(Status.Unauthorized))
        }
        if (!(await getUser({ user, id: req.body.overridePluralId }))) {
          return res.status(400).send(error(Status.UserUpdate.InvalidOverride))
        }
        input.overridePluralId = req.body.overridePluralId
      } else {
        input.overridePluralId = null
      }

      user = await $db.user.update({ where: { id: user.id }, data: input })
      // Sync on user update (token&/override)
      user = await syncWithApi(user)

      res.send(data({ user: UserDto.from(user) }))
    })
  )
}, '/user')
