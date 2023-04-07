import { PluralVisibility } from "../system/PluralVisibility";
import {User, UserData} from "@prisma/client";

export interface BaseData {
    user: User & {data: UserData}
}

export interface BaseEntry<TContent extends object = {}> {
    exists: boolean,
    id: string,
    content: TContent
}

export interface VisibilityAttrs {
    private: boolean,
    preventTrusted: boolean
}

export interface AvatarAttrs {
    avatarUuid: string,
    avatarUrl: string
}

// TODO: proxy external (non-apparyllis as AR is a trusted source) URLs
export const parseAvatar = (data: AvatarAttrs & { uid: string }): string|null =>
    data.avatarUrl ? data.avatarUrl : data.avatarUuid ? `https://spaces.apparyllis.com/avatars/${data.uid}/${data.avatarUuid}` : null

export const parseVisibility = (data: VisibilityAttrs) => data.private 
    ? data.preventTrusted 
        ? PluralVisibility.Private
        : PluralVisibility.Trusted
    : PluralVisibility.Public;