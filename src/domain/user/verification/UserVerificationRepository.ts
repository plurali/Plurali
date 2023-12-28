import { isObjectId } from '@domain/common';
import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { User, UserVerification, UserVerificationType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserVerificationRepository extends PrismaRepository<'userVerification'> {
  constructor(prisma: PrismaService) {
    super('userVerification', prisma);
  }

  public async findVerification(id: string, type: UserVerificationType, user?: User): Promise<UserVerification | null> {
    if (!isObjectId(id)) {
      return null;
    }

    const verification = await this.findFirst({
      where: {
        id,
        type,
        ...(user ? { userId: user.id } : {}),
      },
    });

    if (!verification) {
      return null;
    }

    return verification;
  }
}
