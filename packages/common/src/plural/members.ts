import { BaseData, BaseEntry, VisibilityAttrs } from '.'
import { createEndpointCall } from './client'

export type MemberEntry<TContentInfo extends Record<string, string> = Record<string, string>> =
  BaseEntry<MemberContent<TContentInfo>>

export interface MemberContent<TInfo extends Record<string, string> = Record<string, string>>
  extends VisibilityAttrs {
  name: string
  uid: string
  lastOperationTime: number
  avatarUrl: string
  avatarUuid: string
  color: string
  desc: string
  pkId: string
  preventsFrontNotifs: boolean
  pronouns: string
  supportDescMarkdown: true
  info: TInfo
}

export interface GetMembersData extends BaseData {
  systemId: string
}

export interface GetMemberData extends GetMembersData {
  memberId: string
}

export type GetMembersResponse<
  TMemberContentInfo extends Record<string, string> = Record<string, string>
> = MemberEntry<TMemberContentInfo>[]

export type GetMemberResponse<
  TMemberContentInfo extends Record<string, string> = Record<string, string>
> = MemberEntry<TMemberContentInfo>

export const getMembers = createEndpointCall<GetMembersResponse, GetMembersData>(
  async (client, data) =>
    await client.request({
      url: `/v1/members/${data.systemId}`,
      method: 'GET',
      //id: `>>${data.user.id}>>@getMembers(system::${data.systemId})`
    })
)

export const getMember = createEndpointCall<GetMemberResponse, GetMemberData>(
  async (client, data) =>
    await client.request({
      url: `/v1/member/${data.systemId}/${data.memberId}`,
      method: 'GET',
      //id: `>>${data.user.id}>>@getMember(system::${data.systemId}|member::${data.memberId})`
    })
)
