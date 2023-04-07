import {BaseData, BaseEntry, VisibilityAttrs, parseVisibility, parseAvatar} from ".."
import {createEndpointCall} from "../client";
import {MemberField} from "../../system/MemberField";
import {System} from "../../system/System";
import {Prisma, User, UserData, UserFieldData} from "@prisma/client";
import {$db} from "../../db";
import {UserDataDto} from "../../db/UserDataDto";
import {UserFieldDataDto} from "../../db/UserFieldDataDto";

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
        // todo: move away frm this hack
        url: (data.user.overridePluralId ? `/v1/user/${data.user.overridePluralId}` :'/v1/me'),
        method: 'GET'
    })
);

export const transformMemberField = (id: string, system: UserEntry|System, data: UserFieldData) => {
    const field = system instanceof System
        ? system.fields.find((f) => f.fieldId === id)
        : system.content.fields[id];

    const position = field instanceof MemberField ? field.position : field.order;
    const visibility = field instanceof MemberField ? field.pluralVisibility : parseVisibility(field);

    return new MemberField(
        id,
        field.name,
        position,
        visibility,
        UserFieldDataDto.from(data)
    )
}

export const transformUser = async (system: UserEntry, user: User & {
    data: UserData
}, fieldWhere: Prisma.UserFieldWhereInput = {}): Promise<System> => {
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
        const userField = userFields.find(field => field.pluralId === fieldId);
        if (!userField) continue;

        fields.push(transformMemberField(fieldId, system, userField.data))
    }

    return new System(
        system.id,
        new Date(system.content.lastOperationTime),
        system.content.username,
        fields,
        system.content.color.trim().length >= 1 ? system.content.color : null,
        system.content.desc.trim().length >= 1 ? system.content.desc : null,
        parseAvatar(system.content),
        UserDataDto.from(user.data)
    );
}

export const fetchMe = async (data: BaseData, fieldWhere: Partial<Prisma.UserFieldWhereInput> = {}): Promise<System | null> => {
    try {
        return transformUser(
            (await getMe(data)).data,
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