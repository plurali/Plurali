import { MemberField } from './MemberField'
import { UserDataDto } from '../dto/UserDataDto'

export class System {
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