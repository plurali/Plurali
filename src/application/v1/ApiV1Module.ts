import { Module } from '@nestjs/common';
import { PublicSystemController } from './controller/public/PublicSystemController';
import { PublicSystemMemberController } from './controller/public/PublicSystemMemberController';
import { SystemModule } from '@domain/system/SystemModule';
import { PluralModule } from '@domain/plural/PluralModule';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth/AuthController';
import { SystemController } from './controller/system/SystemController';
import { SystemFieldController } from './controller/system/SystemFieldController';
import { SystemMemberController } from './controller/system/SystemMemberController';
import { UserController } from './controller/user/UserController';
import { UserModule } from '@domain/user/UserModule';
import { SecurityModule } from '@domain/security/SecurityModule';
import { CacheModule } from '@domain/cache/CacheModule';

// @deprecated
@Module({
  imports: [SystemModule, PluralModule, UserModule, SecurityModule, CacheModule, JwtModule, PluralModule],
  controllers: [
    PublicSystemController,
    PublicSystemMemberController,
    AuthController,
    SystemController,
    SystemFieldController,
    SystemMemberController,
    UserController,
  ],
})
export class ApiV1Module {}
