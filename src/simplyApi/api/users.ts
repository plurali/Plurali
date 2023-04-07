import {BaseData, BaseEntry, VisibilityAttrs, parseVisibility, parseAvatar} from ".."
import {createEndpointCall} from "../client";
import {MemberField} from "../../system/MemberField";
import {System} from "../../system/System";

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

export interface GetUserData extends BaseData {
    id: string
}

export type GetUserResponse = UserEntry

export const getUser = createEndpointCall<GetUserResponse, GetUserData>(
    async (client, data) => await client.request({
        url: `/v1/user/${data.id}`,
        method: 'GET'
    })
);

export const getMe = createEndpointCall<GetUserResponse>(
    async (client, data) => await client.request({
        url: '/v1/me',
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
        parseAvatar(data.content)
    );
}

export const fetchMe = async (data: BaseData): Promise<System | null> => {
    try {
        return transformUser((data.user.overridePluralId
            ? await getUser({...data, id: data.user.overridePluralId})
            : await getMe(data)).data
        )
    } catch (_) {
        return null;
    }
}

export const fetchUser = async (data: GetUserData): Promise<System | null> => {
    try {
        return await transformUser((await getUser(data)).data)
    } catch (_) {
        return null;
    }
}