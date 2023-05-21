import { ApiProperty } from '@nestjs/swagger';

export class OkResponse {
  @ApiProperty({ default: 'ok' })
  public readonly message: string;

  constructor(message = 'ok') {
    this.message = message;
  }
}
