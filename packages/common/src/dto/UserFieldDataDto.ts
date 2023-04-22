import { UserField } from '@prisma/client';

export class UserFieldDataDto {
  constructor(public customDescription: string | null, public visible: boolean) {}

  public static from(userField: UserField): UserFieldDataDto {
    return new this(userField.customDescription, userField.visible);
  }
}
