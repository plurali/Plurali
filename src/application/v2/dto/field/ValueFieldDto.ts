import { Field, MemberFieldType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { FieldDto } from './FieldDto';
import { FieldDataDto } from './FieldDataDto';

export class ValueFieldDto extends FieldDto {
  @ApiProperty()
  public value: string;

  constructor(id: string, name: string, value: string, position: number, type: MemberFieldType, data: FieldDataDto) {
    super(id, name, position, type, data);
    this.value = value;
  }

  public static fromValue(field: Field, value: string): ValueFieldDto {
    return new ValueFieldDto(
      field.pluralId,
      field.name,
      value,
      field.position,
      field.type,
      new FieldDataDto(field.visibility)
    );
  }
}
