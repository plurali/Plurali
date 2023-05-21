import { PluralVisibility, parseAvatar, parseVisibility } from '@domain/plural/utils';
import { UserMemberDataDto } from './UserMemberDataDto';
import { UserValueFieldDto } from '../field/UserValueFieldDto';
import { PluralMemberEntry } from '@domain/plural/types/rest/members';
import { MemberWithSystem, SystemWithFields } from '@domain/common/types';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @deprecated
 */
export class UserMemberDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public systemId: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public pronouns: string | null;

  @ApiProperty()
  public pluralVisibility: PluralVisibility;

  @ApiProperty()
  public lastModified: Date;

  @ApiProperty()
  public color: string | null;

  @ApiProperty()
  public description: string | null;

  @ApiProperty()
  public fields: UserValueFieldDto[];

  @ApiProperty()
  public data: UserMemberDataDto;

  @ApiProperty()
  public avatar: string | null = null;
  constructor(
    id: string,
    systemId: string,
    name: string,
    pronouns: string | null,
    pluralVisibility: PluralVisibility,
    lastModified: Date,
    color: string | null,
    description: string | null,
    fields: UserValueFieldDto[],
    data: UserMemberDataDto,
    avatar: string | null = null
  ) {
    this.id = id;
    this.systemId = systemId;
    this.name = name;
    this.pronouns = pronouns;
    this.pluralVisibility = pluralVisibility;
    this.lastModified = lastModified;
    this.color = color;
    this.description = description;
    this.fields = fields;
    this.data = data;
    this.avatar = avatar;
  }

  public static from(member: MemberWithSystem<SystemWithFields>, plural: PluralMemberEntry): UserMemberDto {
    return new UserMemberDto(
      member.pluralId,
      member.pluralParentId,
      plural.content.name,
      plural.content.pronouns,
      parseVisibility(plural.content),
      new Date(plural.content.lastOperationTime),
      plural.content.color,
      plural.content.desc,
      Object.keys(plural.content.info ?? {})
        .map(id => {
          const field = member.system.fields.find(f => f.pluralId === id);
          if (!field) return null;

          return UserValueFieldDto.from(field, plural.content.info[id]);
        })
        .filter(v => !!v),
      UserMemberDataDto.from(member),
      parseAvatar(plural.content)
    );
  }
}
