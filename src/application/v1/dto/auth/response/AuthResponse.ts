import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/UserDto';

export class AuthResponse {
  @ApiProperty()
  public readonly user: UserDto;

  @ApiProperty()
  public readonly auth: string;

  constructor(user: UserDto, auth: string) {
    this.user = user;
    this.auth = auth;
  }
}
