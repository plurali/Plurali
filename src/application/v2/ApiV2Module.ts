import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PageModule } from '@domain/page/PageModule';
import { PluralModule } from '@domain/plural/PluralModule';
import { SystemModule } from '@domain/system/SystemModule';
import { UserModule } from '@domain/user/UserModule';
import { MemberPageController } from './controller/member/MemberPageController';
import { SystemPageController } from './controller/system/SystemPageController';
import { PublicMemberPageController } from './controller/member/PublicMemberPageController';
import { PublicSystemPageController } from './controller/system/PublicSystemPageController';

@Module({
  imports: [PageModule, SystemModule, UserModule, JwtModule, PluralModule],
  controllers: [MemberPageController, SystemPageController, PublicMemberPageController, PublicSystemPageController],
})
export class ApiV2Module {}
