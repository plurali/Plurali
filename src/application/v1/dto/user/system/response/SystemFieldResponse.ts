import { ApiProperty } from '@nestjs/swagger';
import { UserFieldDto } from '../../field/UserFieldDto';

export class SystemFieldResponse {
  @ApiProperty()
  public field: UserFieldDto;

  constructor(field: UserFieldDto) {
    this.field = field;
  }
}
