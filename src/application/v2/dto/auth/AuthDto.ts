import { ApiProperty } from '@nestjs/swagger';
import { AuthDtoInterface } from './AuthDtoInterface';

export class AuthDto implements AuthDtoInterface {
  @ApiProperty()
  public readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
