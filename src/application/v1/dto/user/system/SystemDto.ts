import { PluralUserEntry } from '@domain/plural/types/rest/user';
import { UserDataDto } from '../UserDataDto';
import { UserFieldDto } from '../field/UserFieldDto';
import { parseAvatar } from '@domain/plural/utils';
import { SystemWithFields } from '@domain/common/types';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @deprecated
 */
export class SystemDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public lastModified: Date;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public fields: UserFieldDto[];

  @ApiProperty()
  public color: string | null;

  @ApiProperty()
  public description: string | null;

  @ApiProperty()
  public avatar: string | null = null;

  @ApiProperty()
  public data: UserDataDto;

  constructor(
    id: string,
    lastModified: Date,
    username: string,
    fields: UserFieldDto[],
    color: string | null,
    description: string | null,
    avatar: string | null = null,
    data: UserDataDto
  ) {
    this.id = id;
    this.lastModified = lastModified;
    this.username = username;
    this.fields = fields;
    this.color = color;
    this.description = description;
    this.avatar = avatar;
    this.data = data;
  }

  public static from(system: SystemWithFields, plural: PluralUserEntry): SystemDto {
    return new SystemDto(
      system.pluralId,
      new Date(plural.content.lastOperationTime),
      plural.content.username,
      system.fields.map(UserFieldDto.from),
      plural.content.color,
      plural.content.desc,
      parseAvatar(plural.content),
      UserDataDto.from(system)
    );
  }
}
