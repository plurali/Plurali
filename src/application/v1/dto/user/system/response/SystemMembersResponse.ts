import { UserMemberDto } from '../../member/UserMemberDto';

export class SystemMembersResponse {
  constructor(public readonly members: UserMemberDto[]) {}
}
