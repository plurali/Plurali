import { UserDto } from '../UserDto';

export class UserResponse {
  constructor(public readonly user: UserDto) {}
}
