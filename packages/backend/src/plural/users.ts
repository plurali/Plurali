import { UserDataDto, UserFieldDataDto } from '@plurali/common/dist/dto'
import {
  BaseData,
  /*getMe,
  getUser,*/
  GetUserData,
  parseAvatar,
  parseFieldType,
  parseVisibility,
  UserEntry,
} from '@plurali/common/dist/plural'
import { getMe, getUser } from './cached'
import { MemberField, System } from '@plurali/common/dist/system'
import { Prisma, User, UserField } from '@prisma/client'
import { $db } from '../services/db'

export const transformMemberField = (
  id: string,
  system: UserEntry | System,
  data: UserField
) => {
  const field =
    system instanceof System
      ? system.fields.find(f => f.fieldId === id)
      : system.content.fields[id]

  const position = field instanceof MemberField ? field.position : field.order
  const visibility =
    field instanceof MemberField ? field.pluralVisibility : parseVisibility(field)
  const type = field instanceof MemberField ? field.type : parseFieldType(field)

  return new MemberField(
    id,
    field.name,
    position,
    type,
    visibility,
    UserFieldDataDto.from(data)
  )
}

export const transformUser = async (
  userEntry: UserEntry,
  user: User,
  fieldWhere: Prisma.UserFieldWhereInput = {}
): Promise<System> => {
  const fields: MemberField[] = []

  const userFields = await $db.userField.findMany({
    where: {
      pluralOwnerId: userEntry.id,
      ...fieldWhere,
    },
  })

  for (const fieldId in userEntry.content.fields) {
    const userField = userFields.find(field => field.pluralId === fieldId)
    if (!userField) continue

    fields.push(transformMemberField(fieldId, userEntry, userField))
  }

  return new System(
    userEntry.id,
    new Date(userEntry.content.lastOperationTime),
    userEntry.content.username,
    fields,
    userEntry.content.color.trim().length >= 1 ? userEntry.content.color : null,
    userEntry.content.desc.trim().length >= 1 ? userEntry.content.desc : null,
    parseAvatar(userEntry.content),
    UserDataDto.from(user)
  )
}

export const fetchMe = async (
  data: BaseData,
  fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}
): Promise<System | null> => {
  try {
    return transformUser((await getMe(data)).data, data.user, fieldWhere)
  } catch (_) {
    return null
  }
}

export const fetchUser = async (
  data: GetUserData,
  fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}
): Promise<System | null> => {
  try {
    return await transformUser((await getUser(data)).data, data.user, fieldWhere)
  } catch (_) {
    return null
  }
}
