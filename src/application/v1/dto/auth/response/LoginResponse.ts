import { UserDto } from '../../user/UserDto';

export class LoginResponse {
  constructor(public readonly user: UserDto, public readonly auth: string) {}
}
