import { Field, MemberFieldType, Visibility } from '@prisma/client';
import { UserFieldDataDto } from './UserFieldDataDto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @deprecated
 */
export class UserFieldDto {
  @ApiProperty()
  public fieldId: string;

  @ApiProperty()
  public name: string;

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
    position: number,
    type: MemberFieldType,
    pluralVisibility: Visibility,
    data: UserFieldDataDto
  ) {
    this.fieldId = fieldId;
    this.name = name;
    this.position = position;
    this.type = type;
    this.pluralVisibility = pluralVisibility;
    this.data = data;
  }

  public static from(field: Field): UserFieldDto {
    return new UserFieldDto(
      field.pluralId,
      field.name,
      field.position,
      field.type,
      field.visibility,
      new UserFieldDataDto(field.visibility === Visibility.Public)
    );
  }
}
