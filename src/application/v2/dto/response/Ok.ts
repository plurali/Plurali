import { ApiProperty } from '@nestjs/swagger';
import { OkInterface } from './OkInterface';

export class Ok implements OkInterface {
  @ApiProperty({ default: 'ok' })
  public message = 'ok';

  constructor(message = 'ok') {
    this.message = message;
  }
}
