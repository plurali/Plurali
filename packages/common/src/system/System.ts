import { MemberField } from './MemberField.js'
import { UserDataDto } from '../dto/UserDataDto.js'
import { WithBackground } from '../data/index.js'

export class System implements WithBackground {
  constructor(
    public id: string,
    public lastModified: Date,
    public username: string,
    public fields: MemberField[],
    public color: string | null,
    public description: string | null,
    public avatar: string | null = null,
    public data: UserDataDto
  ) {}
}
