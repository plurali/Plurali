import { AuthRequest } from '@app/v1/dto/auth/request/AuthRequest';
import { User } from '@prisma/client';
import { Authenticator } from './Authenticator';
import { UserRepository } from '@domain/user/UserRepository';
import { Hasher } from '../hasher/Hasher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAuthenticator extends Authenticator<AuthRequest, User> {
  constructor(private users: UserRepository, private hasher: Hasher) {
    super();
  }

  async attempt({ username, password }: AuthRequest): Promise<User | null> {
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
