import { Global, Module } from '@nestjs/common';
import { Hasher } from './hasher/Hasher';
import { BcryptHasher } from './hasher/BcryptHasher';
import { Authenticator } from './authenticator/Authenticator';
import { UserAuthenticator } from './authenticator/UserAuthenticator';

@Global()
@Module({
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
})
export class SecurityModule {}
