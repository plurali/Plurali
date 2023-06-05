import { Field } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { FieldDto } from './FieldDto';
import { FieldDataDto } from './FieldDataDto';
import { MemberFieldType } from '@domain/plural/utils';
import { convertFieldType } from '@domain/common';
import { ValueFieldDtoInterface } from './ValueFieldDtoInterface';
import { FieldDataDtoInterface } from './FieldDataDtoInterface';

export class ValueFieldDto extends FieldDto implements ValueFieldDtoInterface {
  public type = "field_value";

  @ApiProperty()
  public value: string;

  constructor(id: string, name: string, value: string, position: number, type: MemberFieldType, data: FieldDataDtoInterface) {
    super(id, name, position, type, data);
    this.value = value;
  }

  public static fromValue(field: Field, value: string): ValueFieldDto {
    return new ValueFieldDto(
      field.pluralId,
      field.name,
      value,
      field.position,
      convertFieldType(field.type),
      new FieldDataDto(field.visibility)
    );
  }
}
