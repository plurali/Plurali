import { PluralMemberEntry } from '@domain/plural/types/rest/members';
import { MemberWithSystem } from '@domain/common/types';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { parseAvatar } from '@domain/plural/utils';
import { MemberDataDto } from './MemberDataDto';

@ApiExtraModels(MemberDataDto)
export class MemberDto {
  @ApiProperty({ default: 'member' })
  public type = 'member';

  @ApiProperty()
  public id: string;

  @ApiProperty()
  public systemId: string;

  @ApiProperty()
  public systemRef: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public pronouns: string | null;

  @ApiProperty()
  public color: string | null;

  @ApiProperty()
  public description: string | null;

  @ApiProperty()
  public data: MemberDataDto;

  @ApiProperty()
  public avatar: string | null = null;
  constructor(
    id: string,
    systemId: string,
    systemSlug: string,
    name: string,
    pronouns: string | null,
    color: string | null,
    description: string | null,
    data: MemberDataDto,
    avatar: string | null = null
  ) {
    this.id = id;
    this.systemId = systemId;
    this.systemRef = systemSlug;
    this.name = name;
    this.pronouns = pronouns;
    this.color = color;
    this.description = description;
    this.data = data;
    this.avatar = avatar;
  }

  public static from(member: MemberWithSystem, plural: PluralMemberEntry): MemberDto {
    return new MemberDto(
      member.id,
      member.systemId,
      member.system.slug,
      plural.content.name,
      plural.content.pronouns,
      plural.content.color,
      plural.content.desc,
      MemberDataDto.from(member),
      parseAvatar(plural.content)
    );
  }
}
