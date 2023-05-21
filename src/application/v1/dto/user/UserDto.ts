import { ApiProperty } from '@nestjs/swagger';
import { User as BaseUser, UserRole } from '@prisma/client';

/**
 * @deprecated
 */
export class UserDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public pluralKey: string | null;

  @ApiProperty()
  public overridePluralId: string | null;

  @ApiProperty()
  public admin: boolean;

  constructor(id: string, username: string, pluralKey: string | null, overridePluralId: string | null, admin: boolean) {
    this.id = id;
    this.username = username;
    this.pluralKey = pluralKey;
    this.overridePluralId = overridePluralId;
    this.admin = admin;
  }

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
