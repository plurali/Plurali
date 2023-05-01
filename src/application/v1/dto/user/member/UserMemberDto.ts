import { PluralVisibility, parseAvatar, parseVisibility } from '@domain/plural/utils';
import { UserMemberDataDto } from './UserMemberDataDto';
import { UserValueFieldDto } from '../field/UserValueFieldDto';
import { PluralMemberEntry } from '@domain/plural/types/rest/members';
import { MemberWithSystem, SystemWithFields } from '@domain/common/types';

/**
 * @deprecated
 */
export class UserMemberDto {
  constructor(
    public id: string,
    public systemId: string,
    public name: string,
    public pronouns: string | null,
    public pluralVisibility: PluralVisibility,
    public lastModified: Date,
    public color: string | null,
    public description: string | null,
    public fields: UserValueFieldDto[],
    public data: UserMemberDataDto,
    public avatar: string | null = null
  ) {}

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
      Object.keys(plural.content.info)
        .map((id, _, fields) => {
          const field = member.system.fields.find(f => f.pluralId === id);
          if (!field) return null;

          return UserValueFieldDto.from(field, fields[id]);
        })
        .filter(v => !!v),
      UserMemberDataDto.from(member),
      parseAvatar(plural.content)
    );
  }
}
