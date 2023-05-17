import { PrismaModule } from '@infra/prisma/PrismaModule';
import { Module } from '@nestjs/common';
import { SystemRepository } from './SystemRepository';
import { MemberRepository } from './member/MemberRepository';
import { FieldRepository } from './field/FieldRepository';

@Module({
  imports: [PrismaModule.forRoot(SystemRepository, MemberRepository, FieldRepository)],
  exports: [PrismaModule],
})
export class SystemModule {}
