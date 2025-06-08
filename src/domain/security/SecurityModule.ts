import { UserModule } from "@domain/user/UserModule";
import { Global, Module } from "@nestjs/common";

import { Authenticator } from "./authenticator/Authenticator";
import { UserAuthenticator } from "./authenticator/user/UserAuthenticator";
import { BcryptHasher } from "./hasher/BcryptHasher";
import { Hasher } from "./hasher/Hasher";

@Global()
@Module({
  imports: [UserModule],
  providers: [
    {
      provide: Hasher,
      useClass: BcryptHasher,
    },
    {
      provide: Authenticator,
      useClass: UserAuthenticator,
    },
    UserAuthenticator,
  ],
  exports: [Hasher, Authenticator, UserAuthenticator],
})
export class SecurityModule {}
