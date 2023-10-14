import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class NotificationRepository extends PrismaRepository<'notification'> {
  constructor(prisma: PrismaService) {
    super('notification', prisma);
  }
}
