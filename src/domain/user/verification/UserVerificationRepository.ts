import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserVerificationRepository extends PrismaRepository<'userVerification'> {
  constructor(prisma: PrismaService) {
    super('userVerification', prisma);
  }
}
