import { getMe, getMembers, MemberEntry, parseVisibility, UserEntry } from '@plurali/common/dist/plural'
import { PluralVisibility } from '@plurali/common/dist/system/PluralVisibility'
import { Prisma, User, UserMember } from '@prisma/client'
import { $db } from '../services/db'
import { createSlug } from '../utils'
import { clearUserCache } from '../services/redis/user'

export const syncMember = async (fetchedMember: MemberEntry, system: UserEntry, user: User): Promise<UserMember> => {
  const member = await $db.userMember.upsert({
    where: {
      pluralId: fetchedMember.id,
    },
    update: {},
    create: {
      user: {
        connect: {
          id: user.id,
        },
      },
      pluralId: fetchedMember.id,
      pluralOwnerId: system.id,
      slug: createSlug(fetchedMember.content.name),
      visible: parseVisibility(fetchedMember.content) === PluralVisibility.Public,
    },
  })

  if (!member.slug) {
    return $db.userMember.update({
      where: {
        id: member.id,
      },
      data: {
        slug: createSlug(fetchedMember.content.name),
      },
    })
  }

  return member
}

export const syncWithApi = async (user: User) => {
  // Clear cache for this user to prevent any BS
  await clearUserCache(user)

  if (!user.pluralKey) {
    return user
  }

  const system = (
    await getMe({
      user,
    })
  ).data

  if (!system.content.isAsystem) {
    // TODO: handle?information about your system & members
    user = await $db.user.update({
      where: {
        id: user.id,
      },
      data: {
        pluralKey: null,
      },
    })
    return user
  }

  user = await $db.user.update({
    where: {
      id: user.id,
    },
    data: {
      slug: user.slug ?? createSlug(system.content.username),
    },
  })

  const userFields = await $db.userField.findMany({
    where: {
      pluralOwnerId: system.id,
    },
  })

  const fieldsToCreate: Prisma.UserFieldCreateManyInput[] = []

  for (const fieldId in system.content.fields) {
    //const field = system.content.fields[fieldId];
    const userField = userFields.find(f => f.pluralId === fieldId)

    if (!userField) {
      fieldsToCreate.push({
        pluralId: fieldId,
        pluralOwnerId: system.id,
        userId: user.id,
        visible: parseVisibility(system.content.fields[fieldId]) === PluralVisibility.Public,
        description: null,
      })
    }
  }

  // Batch insert fields at once
  if (fieldsToCreate.length >= 1) {
    await $db.userField.createMany({
      data: fieldsToCreate,
    })
  }

  const members = (
    await getMembers({
      user,
      systemId: system.id,
    })
  ).data

  for (const fetchedMember of members) {
    await syncMember(fetchedMember, system, user)
  }

  // TODO clear any members not in list

  return user
}
