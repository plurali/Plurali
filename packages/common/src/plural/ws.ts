import { ResolvedToken } from './index.js'

export const socketEndpoint = 'wss://v2.apparyllis.com/v1/socket'

export interface Content<C = {}> {
  content: C
}

export interface InsertMember {
  name: string
  private: boolean
  preventTrusted: boolean
  uid: string
  lastOperationTime: number
}

export interface UpdateMember {
  avatarUrl: string
  avatarUuid: string
  color: string
  desc: string
  pronouns: string
  superDescMode: boolean
  pkId?: string
  preventsFrontNotifs?: boolean
  info?: Record<string, string>
}

export enum OperationType {
  Insert = 'insert',
  Update = 'update',
  Delete = 'delete',
}

export type ActionOperation<O extends OperationType, T = Content> = T & {
  operationType: O
  id: string
}

export type Operation<I = Content, U = Content, D = Content> =
  | ActionOperation<OperationType.Insert, I>
  | ActionOperation<OperationType.Update, U>
  | ActionOperation<OperationType.Delete, D>

export interface BaseMessage {
  msg: string
}

export interface AuthenticatedMessage {
  msg: 'Successfully authenticated'
  resolvedToken: ResolvedToken
}

export interface BaseUpdateMessage {
  msg: 'update'
  target: string
  results: Operation[]
}

export interface MemberUpdateMessage extends BaseUpdateMessage {
  target: 'members'
  results: Operation<Content<InsertMember>, Content<UpdateMember>>[]
}

export type Message = AuthenticatedMessage | MemberUpdateMessage
