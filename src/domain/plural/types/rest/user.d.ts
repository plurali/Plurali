import { BaseData, BaseEntry, VisibilityAttributes } from ".";

export type PluralUserEntry = BaseEntry<UserContent>;

/** @deprecated */
export interface UserCustomField extends VisibilityAttributes {
  name: string;
  order: number;
  type: number;
}

export interface UserContent {
  isAsystem: true;
  lastUpdate: number;
  uid: string;
  username: string;
  /** @deprecated */
  fields?: Record<string, UserCustomField>;
  color: string;
  desc: string;
  avatarUuid: string;
  avatarUrl: string;
  lastOperationTime: number;
  supportDescMarkdown: boolean;
}

export interface GetUserData extends BaseData {
  id: string;
}
