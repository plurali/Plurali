import { PluralUserEntry } from '@domain/plural/types/rest/user';
import { parseAvatar } from '@domain/plural/utils';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { SystemDataDto } from './SystemDataDto';
import { System } from '@prisma/client';

@ApiExtraModels(SystemDataDto)
export class SystemDto {
  @ApiProperty({ default: 'system' })
  public type = 'system';

  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public color: string | null;

  @ApiProperty()
  public description: string | null;

  @ApiProperty()
  public avatar: string | null = null;

  @ApiProperty()
  public data: SystemDataDto;

  constructor(
    id: string,
    name: string,
    color: string | null,
    description: string | null,
    avatar: string | null = null,
    data: SystemDataDto
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.description = description;
    this.avatar = avatar;
    this.data = data;
  }

  public static from(system: System, plural: PluralUserEntry): SystemDto {
    return new SystemDto(
      system.pluralId,
      plural.content.username,
      plural.content.color,
      plural.content.desc,
      parseAvatar(plural.content),
      SystemDataDto.from(system)
    );
  }
}
