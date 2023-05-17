import { User } from '@prisma/client';

export class UserResponse {
  constructor(public readonly user: User) {}
}
