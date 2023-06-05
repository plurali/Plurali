import { ApiProperty } from '@nestjs/swagger';
import { Field, Visibility } from '@prisma/client';
import { FieldDataDtoInterface } from './FieldDataDtoInterface';

export class FieldDataDto implements FieldDataDtoInterface {
  @ApiProperty()
  public visibility: Visibility;

  constructor(visibility: Visibility) {
    this.visibility = visibility;
  }

  public static from(userField: Field): FieldDataDto {
    return new this(userField.visibility);
  }
}
