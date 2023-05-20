import { Module } from '@nestjs/common';
import { PageRepository } from './PageRepository';
import { PrismaModule } from '@infra/prisma/PrismaModule';

@Module({
  imports: [PrismaModule.forRoot(PageRepository)],
  exports: [PrismaModule],
})
export class PageModule {}
