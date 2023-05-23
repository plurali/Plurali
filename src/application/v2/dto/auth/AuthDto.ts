import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  public readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
