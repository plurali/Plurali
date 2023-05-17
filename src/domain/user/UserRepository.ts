import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserRepository extends PrismaRepository<'user'> {
  constructor(prisma: PrismaService) {
    super('user', prisma);
  }
}
