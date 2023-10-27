import { ApiProperty } from '@nestjs/swagger';
import { User as BaseUser, UserRole } from '@prisma/client';
import { UserDtoInterface } from './UserDtoInterface';

export class UserDto implements UserDtoInterface {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public verified: boolean;

  @ApiProperty()
  public accessToken: string | null;

  @ApiProperty()
  public systemIdOverride: string | null;

  @ApiProperty()
  public role: UserRole;

  constructor(
    id: string,
    username: string,
    email: string,
    verified: boolean,
    accessToken: string | null,
    systemIdOverride: string | null,
    role: UserRole
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.verified = verified;
    this.accessToken = accessToken;
    this.systemIdOverride = systemIdOverride;
    this.role = role;
  }

  public static from(user: BaseUser): UserDto {
    return new this(
      user.id,
      user.username,
      user.email,
      user.emailVerified,
      user.pluralAccessToken ?? null,
      user.pluralOverride ?? null,
      user.role
    );
  }
}
