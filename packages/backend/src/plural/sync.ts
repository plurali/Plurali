import { getMe, getMembers, MemberEntry, parseVisibility, UserEntry } from '@plurali/common/dist/plural'
import { PluralVisibility } from '@plurali/common/dist/system/PluralVisibility'
import { Prisma, User, UserMember } from '@prisma/client'
import { $db } from '../services/db'
import { createSlug } from '../utils'
import { clearCacheByUser } from '../services/redis/utils'

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

export const syncFields = async (system: UserEntry, user: User) => {
  const userFields = await $db.userField.findMany({
    where: {
      pluralOwnerId: system.id,
    },
  })

  const fieldsToCreate: Prisma.UserFieldCreateManyInput[] = []

  for (const fieldId in system.content.fields) {
    const userField = userFields.find(f => f.pluralId === fieldId)

    if (!userField) {
      fieldsToCreate.push({
        pluralId: fieldId,
        pluralOwnerId: system.id,
        userId: user.id,
        visible: parseVisibility(system.content.fields[fieldId]) === PluralVisibility.Public,
        customDescription: null,
      })
    }
  }

  // Batch insert fields at once
  if (fieldsToCreate.length >= 1) {
    await $db.userField.createMany({
      data: fieldsToCreate,
    })
  }

  // Delete all fields that are not listed by SP anymore
  await $db.userField.deleteMany({
    where: {
      userId: user.id,
      pluralId: {
        notIn: Object.keys(system.content.fields),
      },
    },
  })
}

export const syncWithApi = async (user: User): Promise<User> => {
  // Clear cache for this user to prevent any BS
  await clearCacheByUser(user)

  if (!user.pluralKey) {
    return user
  }

  const system = (
    await getMe({
      user,
    })
  ).data

  if (!system.content.isAsystem) {
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

  await syncFields(system, user);

  const members = (
    await getMembers({
      user,
      systemId: system.id,
    })
  ).data

  for (const fetchedMember of members) {
    await syncMember(fetchedMember, system, user)
  }

  // Delete all members that are not listed by SP anymore
  await $db.userMember.deleteMany({
    where: {
      userId: user.id,
      pluralId: {
        notIn: members.map(member => member.id),
      },
    },
  })

  return user
}
