import { ApiProperty } from '@nestjs/swagger';
import { User as BaseUser, UserRole } from '@prisma/client';

export class UserDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public accessToken: string | null;

  @ApiProperty()
  public systemIdOverride: string | null;

  @ApiProperty()
  public role: UserRole;

  constructor(
    id: string,
    username: string,
    accessToken: string | null,
    systemIdOverride: string | null,
    role: UserRole
  ) {
    this.id = id;
    this.username = username;
    this.accessToken = accessToken;
    this.systemIdOverride = systemIdOverride;
    this.role = role;
  }

  public static from(user: BaseUser): UserDto {
    return new this(user.id, user.username, user.pluralAccessToken ?? null, user.pluralOverride ?? null, user.role);
  }
}
