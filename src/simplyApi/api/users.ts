import {BaseData, BaseEntry, VisibilityAttrs, parseVisibility, parseAvatar} from ".."
import {createEndpointCall} from "../client";
import {MemberField} from "../../system/MemberField";
import {System} from "../../system/System";
import {Prisma, User, UserData} from "@prisma/client";
import {$db} from "../../db";

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

export const transformUser = async (system: UserEntry, user: User & {data: UserData}, fieldWhere: Prisma.UserFieldWhereInput = {}): Promise<System> => {
    let fields: MemberField[] = [];

    const userFields = await $db.userField.findMany({
        where: {
            pluralOwnerId: system.id,
            ...fieldWhere,
        },
        include: {
            data: true
        }
    })

    for (const fieldId in system.content.fields) {
        const field = system.content.fields[fieldId]
        if (!field) continue;

        const userField = userFields.find(field => field.pluralId === fieldId);
        if (!userField) continue;

        fields.push(new MemberField(fieldId, field.name, field.order, parseVisibility(field), userField.data))
    }

    return new System(
        system.id,
        new Date(system.content.lastOperationTime),
        system.content.username,
        fields,
        system.content.color.trim().length >= 1 ? system.content.color : null,
        system.content.desc.trim().length >= 1 ? system.content.desc : null,
        parseAvatar(system.content),
        user.data
    );
}

export const fetchMe = async (data: BaseData, fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}): Promise<System | null> => {
    try {
        return transformUser(
            (data.user.overridePluralId ? await getUser({
                ...data,
                id: data.user.overridePluralId
            }) : await getMe(data)).data,
            data.user,
            fieldWhere
        )
    } catch (_) {
        return null;
    }
}

export const fetchUser = async (data: GetUserData, fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}): Promise<System | null> => {
    try {
        return await transformUser((await getUser(data)).data, data.user, fieldWhere)
    } catch (_) {
        return null;
    }
}