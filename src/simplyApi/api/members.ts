import {BaseData, BaseEntry, VisibilityAttrs, parseVisibility, parseAvatar} from ".."
import { createEndpointCall } from "../client";
import { Member } from "../../system/Member";
import { MemberFieldWithValue } from "../../system/MemberField";
import { System } from "../../system/System";

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

export const transformMember = (data: MemberEntry, system: System): Member => {
    let fields: MemberFieldWithValue[] = [];
    
    for (const fieldId in data.content.info) {
        const sysField = system.fields.find(field => field.fieldId === fieldId);

        if (!sysField) continue;

        fields.push(new MemberFieldWithValue(
            sysField.fieldId, 
            sysField.name, 
            sysField.position, 
            sysField.visibility, 
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
        parseAvatar(data.content)
    )
}

export const fetchMembers = async (data: BaseData, system: System): Promise<Member[]> => {
    try {
        return (await getMembers({
            key: data.key,
            systemId: system.id
        })).data.map((m) => transformMember(m, system))
    } catch {
        return [];
    }
}