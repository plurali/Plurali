import {BaseData, BaseEntry, VisibilityAttrs, parseVisibility, parseAvatar} from ".."
import {createEndpointCall} from "../client";
import {Member} from "../../system/Member";
import {MemberFieldWithValue} from "../../system/MemberField";
import {System} from "../../system/System";
import {UserMember, UserMemberData} from "@prisma/client";
import {$db} from "../../db";
import {Prisma} from "@prisma/client";

export type MemberEntry<TContentInfo extends Record<string, string> = Record<string, string>> = BaseEntry<MemberContent<TContentInfo>>;

export interface MemberContent<TInfo extends Record<string, string> = Record<string, string>> extends VisibilityAttrs {
    name: string,
    uid: string,
    lastOperationTime: number,
    avatarUrl: string,
    avatarUuid: string,
    color: string,
    desc: string,
    pkId: string,
    preventsFrontNotifs: boolean,
    pronouns: string,
    supportDescMarkdown: true,
    info: TInfo
}

export interface GetMembersData extends BaseData {
    systemId: string
}

export interface GetMemberData extends GetMembersData {
    memberId: string
}

export type GetMembersResponse<TMemberContentInfo extends Record<string, string> = Record<string, string>> = MemberEntry<TMemberContentInfo>[];

export type GetMemberResponse<TMemberContentInfo extends Record<string, string> = Record<string, string>> = MemberEntry<TMemberContentInfo>;

export const getMembers = createEndpointCall<GetMembersResponse, GetMembersData>(
    async (client, data) => await client.request({
        url: `/v1/members/${data.systemId}`,
        method: 'GET'
    })
);

export const getMember = createEndpointCall<GetMemberResponse, GetMemberData>(
    async (client, data) => await client.request({
        url: `/v1/member/${data.systemId}/${data.memberId}`,
        method: 'GET'
    })
);


export const transformMember = async (data: MemberEntry, system: System, userMember: UserMember & {
    data: UserMemberData
}, fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}): Promise<Member> => {
    let fields: MemberFieldWithValue[] = [];

    const userFields = await $db.userField.findMany({
        where: {
            pluralOwnerId: system.id,
            ...fieldWhere
        },
        include: {
            data: true
        }
    })

    for (const fieldId in data.content.info) {
        const sysField = system.fields.find(field => field.fieldId === fieldId);
        if (!sysField) continue;

        const userField = userFields.find((field) => field.pluralId === fieldId);
        if (!userField) continue;

        fields.push(new MemberFieldWithValue(
            sysField.fieldId,
            sysField.name,
            sysField.position,
            sysField.visibility,
            userField.data,
            data.content.info[fieldId]
        ));
    }

    return new Member(
        data.id,
        data.content.name,
        data.content.pronouns.trim().length >= 1 ? data.content.pronouns : null,
        parseVisibility(data.content),
        new Date(data.content.lastOperationTime),
        data.content.color.trim().length >= 1 ? data.content.color : null,
        data.content.desc.trim().length >= 1 ? data.content.desc : null,
        fields,
        parseAvatar(data.content),
        userMember.data,
    )
}

export const fetchMembers = async (data: BaseData, system: System, where: Partial<Prisma.UserMemberWhereInput> = {}, fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}): Promise<Member[]> => {
    try {
        let transformed: Member[] = [];
        const members = (await getMembers({...data, systemId: system.id})).data;
        for (const member of members) {
            let userMember = await $db.userMember.findFirst({
                where: {
                    pluralId: member.id,
                    pluralOwnerId: system.id,
                    userId: data.user.id,
                    ...where
                },
                include: {
                    data: true
                }
            })

            if (!userMember) {
                continue;
            }

            transformed.push(await transformMember(member, system, userMember, fieldWhere))
        }

        return transformed;
    } catch {
        return [];
    }
}

export const fetchMember = async (data: BaseData & {
    id: string
}, system: System, where: Partial<Prisma.UserMemberWhereInput> = {}, fieldWhere: Partial<Prisma.UserMemberWhereInput> = {}): Promise<Member | null> => {
    try {
        const userMember = await $db.userMember.findFirst({
            where: {
                pluralId: data.id,
                pluralOwnerId: system.id
            },
            include: {
                data: true
            }
        })

        if (!userMember) {
            return null;
        }

        return await transformMember((await getMember({
            ...data,
            systemId: system.id,
            memberId: data.id
        })).data, system, userMember, fieldWhere)
    } catch {
        return null;
    }
}