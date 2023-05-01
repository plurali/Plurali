import { Field, MemberFieldType, Visibility } from '@prisma/client';
import { UserFieldDataDto } from './UserFieldDataDto';

/**
 * @deprecated
 */
export class UserFieldDto {
  constructor(
    public fieldId: string,
    public name: string,
    public position: number,
    public type: MemberFieldType,
    public pluralVisibility: Visibility,
    public data: UserFieldDataDto
  ) {}

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
