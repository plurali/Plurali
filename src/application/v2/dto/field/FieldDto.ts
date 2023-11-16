import { Field } from '@prisma/client';
import { FieldDataDto } from './FieldDataDto';
import { ApiProperty } from '@nestjs/swagger';
import { MemberFieldType } from '@domain/plural/utils';
import { convertFieldType } from '@domain/common';
import { FieldDtoInterface } from './FieldDtoInterface';
import { FieldDataDtoInterface } from './FieldDataDtoInterface';

export class FieldDto implements FieldDtoInterface {
  public type = 'field';

  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public position: number;

  @ApiProperty({ default: MemberFieldType.String, enum: Object.keys(MemberFieldType) })
  public fieldType: MemberFieldType;

  @ApiProperty()
  public data: FieldDataDtoInterface;

  constructor(id: string, name: string, position: number, fieldType: MemberFieldType, data: FieldDataDtoInterface) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.fieldType = fieldType;
    this.data = data;
  }

  public static from(field: Field): FieldDto {
    return new FieldDto(
      field.pluralId,
      field.name,
      field.position,
      convertFieldType(field.type),
      new FieldDataDto(field.visibility),
    );
  }
}
