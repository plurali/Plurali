import { UserField } from '@prisma/client';

export class UserFieldDataDto {
  constructor(public visible: boolean) {}

  public static from(userField: UserField): UserFieldDataDto {
    return new this(userField.visible);
  }
}
