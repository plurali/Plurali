import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../UserDto';

export class UserResponse {
  @ApiProperty()
  public user: UserDto;

  constructor(user: UserDto) {
    this.user = user;
  }
}
