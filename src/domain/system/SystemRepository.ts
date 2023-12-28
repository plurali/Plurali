import { SystemWithCollections, SystemWithUser } from '@domain/common/types';
import { Prisma, Visibility } from '@prisma/client';
import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PaginationQuery } from '@app/v2/controller/BaseController';
import { isObjectId } from '@domain/common';

@Injectable()
export class SystemRepository extends PrismaRepository<'system'> {
  constructor(prisma: PrismaService) {
    super('system', prisma);
  }

  public async findPublic(
    identifier: string,
    memberQuery?: PaginationQuery,
  ): Promise<SystemWithUser & SystemWithCollections> {
    if (!identifier) return null;

    const data = await this.findPublicBase(identifier, {
      user: true,
      fields: {
        where: {
          visibility: Visibility.Public,
        },
      },
      members: {
        where: {
          visibility: Visibility.Public,
        },
        ...(memberQuery ? memberQuery : {}),
      },
    });

    if (!data) {
      return null;
    }

    data.fields = data.fields.filter(f => f.visibility === Visibility.Public); // TODO: include in query

    return data as SystemWithUser & SystemWithCollections;
  }

  public async findPublicBase(identifier: string, include: Prisma.SystemInclude = undefined) {
    if (!identifier) return null;

    const data = await this.findFirst({
      where: {
        ...(isObjectId(identifier) ? { id: identifier } : { slug: identifier }),
        visibility: Visibility.Public,
      },
      include,
    });

    return data;
  }
}
