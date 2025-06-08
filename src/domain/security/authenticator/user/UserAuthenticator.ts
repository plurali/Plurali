import { UserRepository } from "@domain/user/UserRepository";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { Hasher } from "../../hasher/Hasher";
import { Authenticator } from "../Authenticator";
import { UserCredentials } from "./types";

@Injectable()
export class UserAuthenticator extends Authenticator<UserCredentials, User> {
  constructor(
    private users: UserRepository,
    private hasher: Hasher,
  ) {
    super();
  }

  async attempt({ username, password }: UserCredentials): Promise<User | null> {
    const user = await this.users.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!user || !this.hasher.verify(password, user.passwordHash)) {
      return null;
    }

    return user;
  }
}
