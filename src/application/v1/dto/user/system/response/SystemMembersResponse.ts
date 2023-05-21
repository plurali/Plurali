import { ApiProperty } from '@nestjs/swagger';
import { UserMemberDto } from '../../member/UserMemberDto';

export class SystemMembersResponse {
  @ApiProperty({ type: [UserMemberDto] })
  public members: UserMemberDto[];

  constructor(members: UserMemberDto[]) {
    this.members = members;
  }
}
