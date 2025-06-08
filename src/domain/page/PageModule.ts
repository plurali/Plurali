import { PrismaModule } from "@infra/prisma/PrismaModule";
import { Module } from "@nestjs/common";

import { PageRepository } from "./PageRepository";

@Module({
  imports: [PrismaModule.forRoot(PageRepository)],
  exports: [PrismaModule],
})
export class PageModule {}
