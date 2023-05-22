import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PageModule } from '@domain/page/PageModule';
import { PluralModule } from '@domain/plural/PluralModule';
import { SystemModule } from '@domain/system/SystemModule';
import { UserModule } from '@domain/user/UserModule';
import { MemberPageController } from './controller/member/page/MemberPageController';
import { SystemPageController } from './controller/system/page/SystemPageController';
import { PublicMemberPageController } from './controller/member/page/PublicMemberPageController';
import { PublicSystemPageController } from './controller/system/page/PublicSystemPageController';
import { PublicMemberController } from './controller/member/PublicMemberController';
import { PublicSystemController } from './controller/system/PublicSystemController';
import { PublicSystemFieldController } from './controller/system/field/PublicSystemFieldController';
import { PublicMemberFieldController } from './controller/member/field/PublicMemberFieldController';

@Module({
  imports: [PageModule, SystemModule, UserModule, JwtModule, PluralModule],
  controllers: [
    MemberPageController,
    SystemPageController,
    PublicSystemController,
    PublicSystemFieldController,
    PublicSystemPageController,
    PublicMemberController,
    PublicMemberFieldController,
    PublicMemberPageController,
  ],
})
export class ApiV2Module {}
