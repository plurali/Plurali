import { Field, MemberFieldType, Visibility } from '@prisma/client';
import { UserFieldDataDto } from './UserFieldDataDto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @deprecated
 */
export class UserValueFieldDto {
  @ApiProperty()
  public fieldId: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public value: string;

  @ApiProperty()
  public position: number;

  @ApiProperty()
  public type: MemberFieldType;

  @ApiProperty()
  public pluralVisibility: Visibility;

  @ApiProperty()
  public data: UserFieldDataDto;

  constructor(
    fieldId: string,
    name: string,
    value: string,
    position: number,
    type: MemberFieldType,
    pluralVisibility: Visibility,
    data: UserFieldDataDto,
  ) {
    this.fieldId = fieldId;
    this.name = name;
    this.value = value;
    this.position = position;
    this.type = type;
    this.pluralVisibility = pluralVisibility;
    this.data = data;
  }

  public static from(field: Field, value: string): UserValueFieldDto {
    return new UserValueFieldDto(
      field.pluralId,
      field.name,
      value,
      field.position,
      field.type,
      field.visibility,
      new UserFieldDataDto(field.visibility === Visibility.Public),
    );
  }
}
