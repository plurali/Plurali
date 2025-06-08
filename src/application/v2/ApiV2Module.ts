import { NotificationModule } from "@domain/notification/NotificationModule";
import { PageModule } from "@domain/page/PageModule";
import { PluralModule } from "@domain/plural/PluralModule";
import { SystemModule } from "@domain/system/SystemModule";
import { UserModule } from "@domain/user/UserModule";
import { StorageModule } from "@infra/storage/StorageModule";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./controller/auth/AuthController";
import { MemberFieldController } from "./controller/member/field/MemberFieldController";
import { PublicMemberFieldController } from "./controller/member/field/PublicMemberFieldController";
import { MemberController } from "./controller/member/MemberController";
import { MemberPageController } from "./controller/member/page/MemberPageController";
import { PublicMemberPageController } from "./controller/member/page/PublicMemberPageController";
import { PublicMemberController } from "./controller/member/PublicMemberController";
import { NotificationController } from "./controller/notification/NotificationController";
import { PublicSystemFieldController } from "./controller/system/field/PublicSystemFieldController";
import { SystemFieldController } from "./controller/system/field/SystemFieldController";
import { PublicSystemPageController } from "./controller/system/page/PublicSystemPageController";
import { SystemPageController } from "./controller/system/page/SystemPageController";
import { PublicSystemController } from "./controller/system/PublicSystemController";
import { SystemController } from "./controller/system/SystemController";
import { UserController } from "./controller/user/UserController";

@Module({
  imports: [PageModule, SystemModule, UserModule, NotificationModule, JwtModule, PluralModule, StorageModule],
  controllers: [
    AuthController,
    UserController,
    MemberController,
    MemberFieldController,
    MemberPageController,
    SystemController,
    SystemFieldController,
    SystemPageController,
    NotificationController,
    PublicSystemController,
    PublicSystemFieldController,
    PublicSystemPageController,
    PublicMemberController,
    PublicMemberFieldController,
    PublicMemberPageController,
  ],
})
export class ApiV2Module {}
