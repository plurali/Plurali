import { UserMemberDataDto, UserFieldDataDto } from '@plurali/common/dist/dto'
import { BaseData, getMember, getMembers, MemberEntry, parseAvatar, parseVisibility } from '@plurali/common/dist/plural'
import { Member, MemberFieldWithValue, System } from '@plurali/common/dist/system'
import { Prisma, UserField, UserMember } from '@prisma/client'
import { $db } from '../services/db'

export const transformFieldWithValue = (id: string, member: MemberEntry, system: System, userField: UserField) => {
  const field = system.fields.find(field => field.fieldId === id)

  return new MemberFieldWithValue(
    field.fieldId,
    field.name,
    field.position,
    field.type,
    field.pluralVisibility,
    UserFieldDataDto.from(userField),
    member.content.info[id]
  )
}

export const transformMember = async (
  data: MemberEntry,
  system: System,
  userMember: UserMember,
  fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}
): Promise<Member> => {
  const fields: MemberFieldWithValue[] = []

  const userFields = await $db.userField.findMany({
    where: {
      pluralOwnerId: system.id,
      ...fieldWhere,
    },
  })

  for (const fieldId in data.content.info) {
    const userField = userFields.find(field => field.pluralId === fieldId)
    if (!userField) continue

    fields.push(transformFieldWithValue(fieldId, data, system, userField))
  }

  return new Member(
    data.id,
    system.id,
    data.content.name,
    data.content.pronouns.trim().length >= 1 ? data.content.pronouns : null,
    parseVisibility(data.content),
    new Date(data.content.lastOperationTime),
    data.content.color.trim().length >= 1 ? data.content.color : null,
    data.content.desc.trim().length >= 1 ? data.content.desc : null,
    fields,
    parseAvatar(data.content),
    UserMemberDataDto.from(userMember)
  )
}

export const fetchMembers = async (
  data: BaseData,
  system: System,
  where: Partial<Prisma.UserMemberWhereInput> = {},
  fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}
): Promise<Member[]> => {
  try {
    const transformed: Member[] = []
    const members = (
      await getMembers({
        ...data,
        systemId: system.id,
      })
    ).data
    for (const member of members) {
      const userMember = await $db.userMember.findFirst({
        where: {
          pluralId: member.id,
          pluralOwnerId: system.id,
          userId: data.user.id,
          ...where,
        },
      })

      if (!userMember) {
        continue
      }

      transformed.push(await transformMember(member, system, userMember, fieldWhere))
    }

    return transformed
  } catch {
    return []
  }
}

export const fetchMember = async (
  data: BaseData & {
    id: string
  },
  system: System,
  where: Partial<Prisma.UserMemberWhereInput> = {},
  fieldWhere: Partial<Prisma.UserMemberWhereInput> = {}
): Promise<Member | null> => {
  try {
    const userMember = await $db.userMember.findFirst({
      where: {
        pluralId: data.id,
        pluralOwnerId: system.id,
        ...where,
      },
    })

    if (!userMember) {
      return null
    }

    return await transformMember(
      (
        await getMember({
          ...data,
          systemId: system.id,
          memberId: data.id,
        })
      ).data,
      system,
      userMember,
      fieldWhere
    )
  } catch {
    return null
  }
}