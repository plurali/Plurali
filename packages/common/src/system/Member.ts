import { MemberFieldWithValue } from './MemberField.js'
import { PluralVisibility } from './PluralVisibility.js'
import { UserMemberDataDto } from '../dto/UserMemberDataDto.js'
import { WithBackground } from '../data/index.js'

export class Member implements WithBackground {
  constructor(
    public id: string,
    public systemId: string,
    public name: string,
    public pronouns: string | null,
    public pluralVisibility: PluralVisibility,
    public lastModified: Date,
    public color: string | null,
    public description: string | null,
    public fields: MemberFieldWithValue[],
    public data: UserMemberDataDto,
    public avatar: string | null = null,
  ) {}
}
