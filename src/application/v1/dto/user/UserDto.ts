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
  public email: string | null;

  @ApiProperty()
  public verified: boolean;

  @ApiProperty()
  public pluralKey: string | null;

  @ApiProperty()
  public overridePluralId: string | null;

  @ApiProperty()
  public admin: boolean;

  constructor(
    id: string, 
    username: string, 
    email: string | null,
    verified: boolean,
    pluralKey: string | null, 
    overridePluralId: string | null, 
    admin: boolean
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.verified = verified;
    this.pluralKey = pluralKey;
    this.overridePluralId = overridePluralId;
    this.admin = admin;
  }

  public static from(user: BaseUser): UserDto {
    return new this(
      user.id,
      user.username,
      user.email,
      user.emailVerified,
      user.pluralAccessToken ?? null,
      user.pluralOverride ?? null,
      user.role === UserRole.Admin
    );
  }
}
