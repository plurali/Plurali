import { ApiProperty } from '@nestjs/swagger';
import { UserFieldDto } from '../../field/UserFieldDto';

export class SystemFieldsResponse {
  @ApiProperty({ type: [UserFieldDto] })
  public fields: UserFieldDto[];

  constructor(fields: UserFieldDto[]) {
    this.fields = fields;
  }
}
