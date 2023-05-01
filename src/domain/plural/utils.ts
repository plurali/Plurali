// TODO: proxy external (non-apparyllis as AR is a trusted source) URLs

import { AvatarAttrs, VisibilityAttributes } from './types/rest';

export enum SocketOperationType {
  Insert = 'insert',
  Update = 'update',
  Delete = 'delete',
}

export enum PluralVisibility {
  Trusted = 'Trusted',
  Private = 'Private',
  Public = 'Public',
}

export enum MemberFieldType {
  String = 'String',
  Color = 'Color',
  Date = 'Date',
  Month = 'Month',
  Year = 'Year',
  MonthYear = 'MonthYear',
  Timestamp = 'Timestamp',
  MonthDay = 'MonthDay',
}

// https://github.com/ApparyllisOrg/SimplyPluralApi/blob/e8950618419bcd6aefcb238d71b09d5814034adf/src/api/v1/user/generateReport.ts#L47
export const parseAvatar = (
  data: AvatarAttrs & {
    uid: string;
  }
): string | null =>
  data.avatarUuid
    ? `https://spaces.apparyllis.com/avatars/${data.uid}/${data.avatarUuid}`
    : data.avatarUrl ?? 'https://apparyllis.com/wp-content/uploads/2021/03/Apparylls_Image.png';

export const parseVisibility = (data: VisibilityAttributes) =>
  data.private ? (data.preventTrusted ? PluralVisibility.Private : PluralVisibility.Trusted) : PluralVisibility.Public;

export const parseFieldType = (fieldInfo: { type: number }): MemberFieldType =>
  [
    MemberFieldType.String,
    MemberFieldType.Color,
    MemberFieldType.Date,
    MemberFieldType.Month,
    MemberFieldType.Year,
    MemberFieldType.MonthYear,
    MemberFieldType.Timestamp,
    MemberFieldType.MonthDay,
  ][fieldInfo.type];

export const PluralObserverUpdateQueue = "plural_obsv_update_queue";