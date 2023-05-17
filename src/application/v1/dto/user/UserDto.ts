import { User as BaseUser, UserRole } from '@prisma/client';

/**
 * @deprecated
 */
export class UserDto {
  constructor(
    public id: string,
    public username: string,
    public pluralKey: string | null,
    public overridePluralId: string | null,
    public admin: boolean
  ) {}

  public static from(user: BaseUser): UserDto {
    return new this(
      user.id,
      user.username,
      user.pluralAccessToken ?? null,
      user.pluralOverride ?? null,
      user.role === UserRole.Admin
    );
  }
}
