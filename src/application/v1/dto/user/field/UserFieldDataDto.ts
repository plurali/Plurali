import { Field, Visibility } from '@prisma/client';

/**
 * @deprecated v2 - merged -> UserFieldDto
 */
export class UserFieldDataDto {
  constructor(public visible: boolean) {}

  public static from(userField: Field): UserFieldDataDto {
    return new this(userField.visibility === Visibility.Public);
  }
}
