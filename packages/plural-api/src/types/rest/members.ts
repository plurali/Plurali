import { BaseEntry, VisibilityAttributes } from '.';

export type PluralMemberEntry<I extends Record<string, string> = Record<string, string>> = BaseEntry<
  PluralMemberContent<I>
>;

export interface PluralMemberContent<I extends Record<string, string> = Record<string, string>>
  extends VisibilityAttributes {
  name: string;
  uid: string;
  lastOperationTime: number;
  avatarUrl: string;
  avatarUuid: string;
  color: string;
  desc: string;
  pkId: string;
  preventsFrontNotifs: boolean;
  pronouns: string;
  supportDescMarkdown: true;
  info: I;
}

export interface GetPluralMembersData {
  systemId: string;
}

export interface GetPluralMemberData extends GetPluralMembersData {
  memberId: string;
}

export type GetMembersResponse<I extends Record<string, string> = Record<string, string>> = PluralMemberEntry<I>[];

export type GetMemberResponse<I extends Record<string, string> = Record<string, string>> = PluralMemberEntry<I>;
