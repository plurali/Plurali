import { UserMemberDto } from '../../member/UserMemberDto';

export class SystemMemberResponse {
  constructor(public readonly member: UserMemberDto) {}
}
