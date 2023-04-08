import {BaseData, BaseEntry, parseAvatar, parseVisibility, VisibilityAttrs} from ".."
import {createEndpointCall} from "../client";
import {Member} from "../../system/Member";
import {MemberFieldWithValue} from "../../system/MemberField";
import {System} from "../../system/System";
import {Prisma, UserField, UserMember} from "@prisma/client";
import {$db} from "../../db";
import {UserMemberDataDto} from "../../db/UserMemberDataDto";
import {UserFieldDataDto} from "../../db/UserFieldDataDto";

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
        method: 'GET',
        //id: `>>${data.user.id}>>@getMembers(system::${data.systemId})`
    })
);

export const getMember = createEndpointCall<GetMemberResponse, GetMemberData>(
    async (client, data) => await client.request({
        url: `/v1/member/${data.systemId}/${data.memberId}`,
        method: 'GET',
        //id: `>>${data.user.id}>>@getMember(system::${data.systemId}|member::${data.memberId})`
    })
);

export const transformFieldWithValue = (id: string, member: MemberEntry, system: System, userField: UserField) => {
    const field = system.fields.find(field => field.fieldId === id);

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

export const transformMember = async (data: MemberEntry, system: System, userMember: UserMember, fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}): Promise<Member> => {
    let fields: MemberFieldWithValue[] = [];

    const userFields = await $db.userField.findMany({
        where: {
            pluralOwnerId: system.id,
            ...fieldWhere
        },
    })

    for (const fieldId in data.content.info) {
        const userField = userFields.find((field) => field.pluralId === fieldId);
        if (!userField) continue;

        fields.push(transformFieldWithValue(fieldId, data, system, userField));
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
        UserMemberDataDto.from(userMember),
    );
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