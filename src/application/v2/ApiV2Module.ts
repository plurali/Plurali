import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PageModule } from '@domain/page/PageModule';
import { PluralModule } from '@domain/plural/PluralModule';
import { SystemModule } from '@domain/system/SystemModule';
import { UserModule } from '@domain/user/UserModule';
import { NotificationModule } from '@domain/notification/NotificationModule';
import { StorageModule } from '@infra/storage/StorageModule';
import { MemberPageController } from './controller/member/page/MemberPageController';
import { SystemPageController } from './controller/system/page/SystemPageController';
import { PublicMemberPageController } from './controller/member/page/PublicMemberPageController';
import { PublicSystemPageController } from './controller/system/page/PublicSystemPageController';
import { PublicMemberController } from './controller/member/PublicMemberController';
import { PublicSystemController } from './controller/system/PublicSystemController';
import { PublicSystemFieldController } from './controller/system/field/PublicSystemFieldController';
import { PublicMemberFieldController } from './controller/member/field/PublicMemberFieldController';
import { AuthController } from './controller/auth/AuthController';
import { UserController } from './controller/user/UserController';
import { MemberController } from './controller/member/MemberController';
import { SystemController } from './controller/system/SystemController';
import { NotificationController } from './controller/notification/NotificationController';

@Module({
  imports: [PageModule, SystemModule, UserModule, NotificationModule, JwtModule, PluralModule, StorageModule],
  controllers: [
    AuthController,
    UserController,
    MemberController,
    MemberPageController,
    SystemController,
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
