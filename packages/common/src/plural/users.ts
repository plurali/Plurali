import { BaseData, BaseEntry, VisibilityAttrs } from './index.js'
import { createEndpointCall } from './client.js'

export type UserEntry = BaseEntry<UserContent>

export interface UserCustomField extends VisibilityAttrs {
  name: string
  order: number
  type: number
}

export interface UserContent {
  isAsystem: true
  lastUpdate: number
  uid: string
  username: string
  fields: Record<string, UserCustomField>
  color: string
  desc: string
  avatarUuid: string
  avatarUrl: string
  lastOperationTime: number
  supportDescMarkdown: boolean
}

export interface GetUserData extends BaseData {
  id: string
}

export type GetUserResponse = UserEntry

export const getUser = createEndpointCall<GetUserResponse, GetUserData>(
  async (client, data) =>
    await client.request({
      url: `/v1/user/${data.id}`,
      method: 'GET',
      //id: `>>${data.user.id}>>@getUser(id::${data.id})`
    })
)

export const getMe = createEndpointCall<GetUserResponse>(
  async (client, data) =>
    await client.request({
      // todo: move away frm this hack
      url: data.user.overridePluralId ? `/v1/user/${data.user.overridePluralId}` : '/v1/me',
      method: 'GET',
      //id: `>>${data.user.id}>>@getMe(override::${data.user.overridePluralId})`
    })
)
