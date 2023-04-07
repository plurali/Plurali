import {User, UserData, UserMember, UserMemberData} from "@prisma/client";
import {getMe, UserEntry} from "./api/users";
import {getMembers, MemberEntry} from "./api/members";
import {$db} from "../db";
import {createSlug} from "../utils";
import {parseVisibility} from "./index";
import {PluralVisibility} from "../system/PluralVisibility";

export const syncMember = async (fetchedMember: MemberEntry, system: UserEntry, user: User & {
    data: UserData
}): Promise<UserMember & {
    data: UserMemberData
}> => {
    const member = (await $db.userMember.findFirst({
        where: {
            userId: user.id,
            pluralId: fetchedMember.id,
            pluralOwnerId: system.id
        },
        include: {
            data: true
        }
    }));

    if (!member) {
        return $db.userMember.create({
            data: {
                user: {connect: {id: user.id}},
                pluralId: fetchedMember.id,
                pluralOwnerId: system.id,
                data: {
                    create: {
                        slug: createSlug(fetchedMember.content.name),
                        visible: parseVisibility(fetchedMember.content) === PluralVisibility.Public,
                    }
                }
            },
            include: {
                data: true
            }
        });
    }

    if (!member.data.slug) {
        return $db.userMember.update({
            where: {
                id: member.data.id,
            },
            data: {
                data: {
                    update: {
                        slug: createSlug(fetchedMember.content.name)
                    }
                }
            },
            include: {
                data: true
            }
        })
    }

    return member;
};

export const syncWithApi = async (user: User & { data: UserData }) => {
    if (!user.pluralKey) {
        return user;
    }

    const system = (await getMe({user})).data;

    if (!system.content.isAsystem) {
        user = await $db.user.update({
            where: {
                id: user.id
            },
            data: {
                pluralKey: null
            },
            include: {
                data: true
            }
        })
        return user;
    }

    if (!user.data) {
        user = await $db.user.update({
            where: {
                id: user.id
            },
            data: {
                data: {
                    create: {
                        visible: false,
                        slug: createSlug(system.content.username)
                    }
                }
            },
            include: {
                data: true
            }
        })
    } else {
        if (!user.data.slug) {
            user = await $db.user.update({
                where: {
                    id: user.data.id,
                },
                data: {
                    data: {
                        update: {
                            slug: createSlug(system.content.username)
                        }
                    }
                },
                include: {
                    data: true
                }
            })
        }
    }

    for (const fieldId in system.content.fields) {
        //const field = system.content.fields[fieldId];
        const userField = await $db.userField.findFirst({
            where: {
                pluralId: fieldId,
                pluralOwnerId: system.id
            }
        })

        if (!userField) {
            await $db.userField.create({
                data: {
                    pluralId: fieldId,
                    pluralOwnerId: system.id,
                    user: {connect: {id: user.id}},
                    data: {
                        create: {
                            visible: false,
                            description: null
                        }
                    }
                }
            })
        }
    }

    const members = (await getMembers({user, systemId: system.id})).data;

    for (const fetchedMember of members) {
        await syncMember(fetchedMember, system, user)
    }

    return user;
}