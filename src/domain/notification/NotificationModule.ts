import { Module } from '@nestjs/common';
import { PrismaModule } from '@infra/prisma/PrismaModule';
import { NotificationRepository } from './NotificationRepository';
import { NotificationService } from './NotificationService';

@Module({
  imports: [PrismaModule.forRoot(NotificationRepository)],
  providers: [NotificationService],
  exports: [PrismaModule, NotificationService],
})
export class NotificationModule { }
