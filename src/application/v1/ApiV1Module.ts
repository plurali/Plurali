import { Module } from '@nestjs/common';
import { PublicSystemController } from './controller/public/PublicSystemController';
import { PublicSystemMemberController } from './controller/public/PublicSystemMemberController';
import { SystemModule } from '@domain/system/SystemModule';
import { PluralModule } from '@domain/plural/PluralModule';

// @deprecated
@Module({
  imports: [SystemModule, PluralModule],
  controllers: [PublicSystemController, PublicSystemMemberController],
})
export class ApiV1Module {}
