import {PluralVisibility} from "../system/PluralVisibility";
import {User} from "@prisma/client";
import {MemberFieldType} from "../system/MemberField";

export interface BaseData {
    user: User
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
// https://github.com/ApparyllisOrg/SimplyPluralApi/blob/e8950618419bcd6aefcb238d71b09d5814034adf/src/api/v1/user/generateReport.ts#L47
export const parseAvatar = (data: AvatarAttrs & { uid: string }): string | null =>
    data.avatarUuid
        ? `https://spaces.apparyllis.com/avatars/${data.uid}/${data.avatarUuid}`
        : data.avatarUrl ?? 'https://apparyllis.com/wp-content/uploads/2021/03/Apparylls_Image.png';

export const parseVisibility = (data: VisibilityAttrs) => data.private
    ? data.preventTrusted
        ? PluralVisibility.Private
        : PluralVisibility.Trusted
    : PluralVisibility.Public;

export const parseFieldType = (fieldInfo: { type: number }): MemberFieldType => [
    MemberFieldType.String,
    MemberFieldType.Color,
    MemberFieldType.Date,
    MemberFieldType.Month,
    MemberFieldType.Year,
    MemberFieldType.MonthYear,
    MemberFieldType.Timestamp,
    MemberFieldType.MonthDay,
][fieldInfo.type];