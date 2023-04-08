import {BaseData, BaseEntry, parseAvatar, parseFieldType, parseVisibility, VisibilityAttrs} from ".."
import {createEndpointCall} from "../client";
import {MemberField} from "../../system/MemberField";
import {System} from "../../system/System";
import {Prisma, User, UserField} from "@prisma/client";
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
        method: 'GET',
        //id: `>>${data.user.id}>>@getUser(id::${data.id})`
    })
);

export const getMe = createEndpointCall<GetUserResponse>(
    async (client, data) => await client.request({
        // todo: move away frm this hack
        url: (data.user.overridePluralId ? `/v1/user/${data.user.overridePluralId}` :'/v1/me'),
        method: 'GET',
        //id: `>>${data.user.id}>>@getMe(override::${data.user.overridePluralId})`
    })
);

export const transformMemberField = (id: string, system: UserEntry|System, data: UserField) => {
    const field = system instanceof System
        ? system.fields.find((f) => f.fieldId === id)
        : system.content.fields[id];

    const position = field instanceof MemberField ? field.position : field.order;
    const visibility = field instanceof MemberField ? field.pluralVisibility : parseVisibility(field);
    const type = field instanceof MemberField ? field.type : parseFieldType(field);

    return new MemberField(
        id,
        field.name,
        position,
        type,
        visibility,
        UserFieldDataDto.from(data)
    )
}

export const transformUser = async (userEntry: UserEntry, user: User, fieldWhere: Prisma.UserFieldWhereInput = {}): Promise<System> => {
    let fields: MemberField[] = [];

    const userFields = await $db.userField.findMany({
        where: {
            pluralOwnerId: userEntry.id,
            ...fieldWhere,
        }
    })

    for (const fieldId in userEntry.content.fields) {
        const userField = userFields.find(field => field.pluralId === fieldId);
        if (!userField) continue;

        fields.push(transformMemberField(fieldId, userEntry, userField))
    }

    return new System(
        userEntry.id,
        new Date(userEntry.content.lastOperationTime),
        userEntry.content.username,
        fields,
        userEntry.content.color.trim().length >= 1 ? userEntry.content.color : null,
        userEntry.content.desc.trim().length >= 1 ? userEntry.content.desc : null,
        parseAvatar(userEntry.content),
        UserDataDto.from(user)
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