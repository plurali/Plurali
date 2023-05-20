import { Global, Module } from '@nestjs/common';
import { Hasher } from './hasher/Hasher';
import { BcryptHasher } from './hasher/BcryptHasher';
import { Authenticator } from './authenticator/Authenticator';
import { UserAuthenticator } from './authenticator/UserAuthenticator';
import { UserModule } from '@domain/user/UserModule';

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
