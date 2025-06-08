import { CacheModule } from "@domain/cache/CacheModule";
import { PageModule } from "@domain/page/PageModule";
import { PluralModule } from "@domain/plural/PluralModule";
import { SecurityModule } from "@domain/security/SecurityModule";
import { SystemModule } from "@domain/system/SystemModule";
import { UserModule } from "@domain/user/UserModule";
import { StorageModule } from "@infra/storage/StorageModule";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./controller/auth/AuthController";
import { PublicSystemController } from "./controller/public/PublicSystemController";
import { PublicSystemMemberController } from "./controller/public/PublicSystemMemberController";
import { PublicSystemMemberPageController } from "./controller/public/PublicSystemMemberPageController";
import { PublicSystemPageController } from "./controller/public/PublicSystemPageController";
import { SystemController } from "./controller/system/SystemController";
import { SystemFieldController } from "./controller/system/SystemFieldController";
import { SystemMemberController } from "./controller/system/SystemMemberController";
import { SystemMemberPageController } from "./controller/system/SystemMemberPageController";
import { SystemPageController } from "./controller/system/SystemPageController";
import { UserController } from "./controller/user/UserController";

// @deprecated
@Module({
  imports: [
    SystemModule,
    PluralModule,
    UserModule,
    SecurityModule,
    CacheModule,
    JwtModule,
    PluralModule,
    StorageModule,
    PageModule,
  ],
  controllers: [
    PublicSystemController,
    PublicSystemPageController,
    PublicSystemMemberController,
    PublicSystemMemberPageController,
    AuthController,
    SystemController,
    SystemFieldController,
    SystemPageController,
    SystemMemberController,
    SystemMemberPageController,
    UserController,
  ],
})
export class ApiV1Module {}
