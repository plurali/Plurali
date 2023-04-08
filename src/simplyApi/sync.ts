import {Prisma, User, UserMember} from "@prisma/client";
import {getMe, UserEntry} from "./api/users";
import {getMembers, MemberEntry} from "./api/members";
import {$db} from "../db";
import {createSlug} from "../utils";
import {parseVisibility} from "./index";
import {PluralVisibility} from "../system/PluralVisibility";

export const syncMember = async (fetchedMember: MemberEntry, system: UserEntry, user: User): Promise<UserMember> => {
    const member = (await $db.userMember.upsert({
        where: {
            pluralId: fetchedMember.id
        },
        update: {},
        create: {
            user: {connect: {id: user.id}},
            pluralId: fetchedMember.id,
            pluralOwnerId: system.id,
            slug: createSlug(fetchedMember.content.name),
            visible: parseVisibility(fetchedMember.content) === PluralVisibility.Public,
        }
    }));

    if (!member.slug) {
        return $db.userMember.update({
            where: {
                id: member.id,
            },
            data: {
                slug: createSlug(fetchedMember.content.name)
            },
        })
    }

    return member;
};

export const syncWithApi = async (user: User) => {
    if (!user.pluralKey) {
        return user;
    }

    const system = (await getMe({user})).data;

    if (!system.content.isAsystem) {
        // TODO: handle?
        user = await $db.user.update({
            where: {
                id: user.id
            },
            data: {
                pluralKey: null
            },
        })
        return user;
    }

    user = await $db.user.update({
        where: {
            id: user.id
        },
        data: {
            visible: user.visible ?? false,
            slug: user.slug ?? createSlug(system.content.username)
        },
    })

    const userFields = await $db.userField.findMany({
        where: {
            pluralOwnerId: system.id
        }
    })

    const fieldsToCreate: Prisma.UserFieldCreateManyInput[] = [];

    for (const fieldId in system.content.fields) {
        //const field = system.content.fields[fieldId];
        const userField = userFields.find(f => f.pluralId === fieldId);

        if (!userField) {
            fieldsToCreate.push({
                pluralId: fieldId,
                pluralOwnerId: system.id,
                userId: user.id,
                visible: false,
                description: null
            })
        }
    }

    // Batch insert fields at once
    if (fieldsToCreate.length >= 1) {
        await $db.userField.createMany({
            data: fieldsToCreate
        })
    }

    const members = (await getMembers({user, systemId: system.id})).data;

    for (const fetchedMember of members) {
        await syncMember(fetchedMember, system, user)
    }

    return user;
}