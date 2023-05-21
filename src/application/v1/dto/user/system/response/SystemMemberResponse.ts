import { ApiProperty } from '@nestjs/swagger';
import { UserMemberDto } from '../../member/UserMemberDto';

export class SystemMemberResponse {
  @ApiProperty()
  public readonly member: UserMemberDto;

  @ApiProperty()
  public readonly warning?: string;

  constructor(member: UserMemberDto, warning?: string) {
    this.member = member;
    this.warning = warning;
  }
}
