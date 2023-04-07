import { BaseData, BaseEntry, VisibilityAttrs, parseVisibility } from ".."
import { createEndpointCall } from "../client";
import { MemberField } from "../../system/MemberField";
import { System } from "../../system/System";

export type UserEntry = BaseEntry<UserContent>;

export interface UserCustomField extends VisibilityAttrs {
    name: string,
    order: number,
    type: number
}

export interface UserContent {
    isAsystem: true,
    lastUpdate: number,
    uid: string,
    username: string,
    fields: Record<string, UserCustomField>,
    color: string,
    desc: string,
    avatarUuid: string,
    avatarUrl: string,
    lastOperationTime: number,
    supportDescMarkdown: boolean
}

export interface GetMeData extends BaseData {
}

export type GetMeResponse = UserEntry

export const getMe = createEndpointCall<GetMeResponse, GetMeData>(
    async (client) => await client.request({
        url: `/v1/me`,
        method: 'GET'
    })
);


export const transformUser = (data: UserEntry): System => {
    let fields: MemberField[] = Object.keys(data.content.fields).map(fieldId => {
        const field = data.content.fields[fieldId];
        return new MemberField(fieldId, field.name, field.order, parseVisibility(field))
    });

    return new System(
        data.id,
        new Date(data.content.lastOperationTime),
        data.content.username,
        fields,
        data.content.color.trim().length >= 1 ? data.content.color : null,
        data.content.desc.trim().length >= 1 ? data.content.desc : null,
    );
}

export const fetchMe = async (data: GetMeData): Promise<System|null> => {
    try {
        return transformUser((await getMe(data)).data)
    } catch (_) {
        return null;
    }
}

export const testKey = async (key: string): Promise<boolean> => !!await fetchMe({key})