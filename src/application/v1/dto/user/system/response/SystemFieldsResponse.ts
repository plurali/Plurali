import { UserFieldDto } from '../../field/UserFieldDto';

export class SystemFieldsResponse {
  constructor(public readonly fields: UserFieldDto[]) {}
}
