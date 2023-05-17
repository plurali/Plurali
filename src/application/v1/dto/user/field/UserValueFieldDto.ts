import { UserFieldDataDto } from './UserFieldDataDto';
import { Field, MemberFieldType, Visibility } from '@prisma/client';

/**
 * @deprecated
 */
export class UserValueFieldDto {
  constructor(
    public fieldId: string,
    public name: string,
    public value: string,
    public position: number,
    public type: MemberFieldType,
    public pluralVisibility: Visibility,
    public data: UserFieldDataDto
  ) {}

  public static from(field: Field, value: string): UserValueFieldDto {
    return new UserValueFieldDto(
      field.pluralId,
      field.name,
      value,
      field.position,
      field.type,
      field.visibility,
      new UserFieldDataDto(field.visibility === Visibility.Public)
    );
  }
}
