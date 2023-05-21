import { SystemWithUser } from '@domain/common/types';
import { Field, Visibility } from '@prisma/client';
import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SystemRepository extends PrismaRepository<'system'> {
  constructor(prisma: PrismaService) {
    super('system', prisma);
  }

  public async findPublic(slug: string): Promise<SystemWithUser & { fields: Field[] }> {
    const data = await this.findFirst({
      where: {
        slug,
        visibility: Visibility.Public,
      },
      include: {
        user: true,
        fields: true,
      },
    });

    if (!data) {
      return null;
    }

    data.fields = data.fields.filter(f => f.visibility === Visibility.Public); // TODO: include in query

    return data;
  }
}