import { SocketOperationType } from "../utils";

export interface Content<C = {}> {
  content: C;
}

export interface InsertMember {
  name: string;
  private: boolean;
  preventTrusted: boolean;
  uid: string;
  lastOperationTime: number;
}

export interface UpdateMember extends InsertMember {
  avatarUrl: string;
  avatarUuid: string;
  color: string;
  desc: string;
  pronouns: string;
  superDescMode: boolean;
  pkId?: string;
  preventsFrontNotifs?: boolean;
  info?: Record<string, string>;
}
export type ActionOperation<O extends SocketOperationType, T = Content> = T & {
  operationType: O;
  id: string;
};

export type Operation<I = Content, U = Content, D = Content> =
  | ActionOperation<SocketOperationType.Insert, I>
  | ActionOperation<SocketOperationType.Update, U>
  | ActionOperation<SocketOperationType.Delete, D>;

export interface BaseMessage {
  msg: string;
}

export interface ResolvedToken {
  uid: string,
  accessTypes: 1 | 2 | 3,
  jwt: boolean
}

export interface AuthenticatedMessage {
  msg: 'Successfully authenticated';
  resolvedToken: ResolvedToken;
}

export interface BaseUpdateMessage {
  msg: 'update';
  target: string;
  results: Operation[];
}

export type MemberOperation = Operation<Content<InsertMember>, Content<UpdateMember>>;

export interface MemberUpdateMessage extends BaseUpdateMessage {
  target: 'members';
  results: MemberOperation[];
}

export type UpdateMessage = MemberUpdateMessage; // reserved to be union type if other update messages are needed

export type Message = AuthenticatedMessage | UpdateMessage;
