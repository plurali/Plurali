import { UserFieldDto } from '../../field/UserFieldDto';

export class SystemFieldResponse {
  constructor(public readonly field: UserFieldDto) {}
}
