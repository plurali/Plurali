import { ApiProperty } from '@nestjs/swagger';

export class Ok {
  @ApiProperty({ default: 'ok' })
  public message = 'ok';

  constructor(message = 'ok') {
    this.message = message;
  }
}
