import { AuthRequestBody } from '@app/v1/dto/auth/request/AuthRequestBody';
import { User } from '@prisma/client';
import { Authenticator } from './Authenticator';
import { UserRepository } from '@domain/user/UserRepository';
import { Hasher } from '../hasher/Hasher';

export class UserAuthenticator extends Authenticator<AuthRequestBody, User> {
  constructor(private users: UserRepository, private hasher: Hasher) {
    super();
  }

  async attempt({ username, password }: AuthRequestBody): Promise<User | null> {
    const user = await this.users.findUnique({
      where: {
        username,
      },
    });

    if (!user || !this.hasher.verify(password, user.passwordHash)) {
      return null;
    }

    return user;
  }
}
