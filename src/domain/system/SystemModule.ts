import { PrismaModule } from "@infra/prisma/PrismaModule";
import { Module } from "@nestjs/common";

import { FieldRepository } from "./field/FieldRepository";
import { MemberRepository } from "./member/MemberRepository";
import { SystemRepository } from "./SystemRepository";

@Module({
  imports: [PrismaModule.forRoot(SystemRepository, MemberRepository, FieldRepository)],
  exports: [PrismaModule],
})
export class SystemModule {}
