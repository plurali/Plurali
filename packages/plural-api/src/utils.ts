import { MemberFieldType, PluralVisibility } from './types/enums';
import { AvatarAttrs, VisibilityAttributes } from './types/rest';

// https://github.com/ApparyllisOrg/SimplyPluralApi/blob/e8950618419bcd6aefcb238d71b09d5814034adf/src/api/v1/user/generateReport.ts#L47
export const parseAvatar = (
  data: AvatarAttrs & {
    uid: string;
  },
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

export const PluralObserverUpdateQueue = 'plural_obsv_update_queue';
