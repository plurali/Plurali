import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PageRepository extends PrismaRepository<'page'> {
  constructor(prisma: PrismaService) {
    super('page', prisma);
  }
}
