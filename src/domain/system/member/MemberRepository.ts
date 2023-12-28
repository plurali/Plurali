import { PaginationQuery } from '@app/v2/controller/BaseController';
import { isObjectId } from '@domain/common';
import { MemberWithSystem, SystemWithFields, SystemWithUser } from '@domain/common/types';
import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { Member, System, Visibility, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MemberRepository extends PrismaRepository<'member'> {
  constructor(prisma: PrismaService) {
    super('member', prisma);
  }

  public async findByIdentifier(identifier: string, where: Prisma.MemberWhereInput = {}): Promise<Member | null> {
    if (!identifier) return null;

    const data = await this.findFirst({
      where: {
        ...(isObjectId(identifier) ? { id: identifier } : { slug: identifier }),
        ...where,
      },
    });

    if (!data) {
      return null;
    }

    return data;
  }

  public async findPublic(
    identifier: string,
    system: System | string,
  ): Promise<MemberWithSystem<SystemWithUser & SystemWithFields>> {
    if (!identifier || !system) return null;

    const data = await this.findFirst({
      where: {
        visibility: Visibility.Public,
        ...(isObjectId(identifier) ? { id: identifier } : { slug: identifier }),
        ...this.createSystemQueryPartial(system),
      },
      include: {
        system: {
          include: {
            user: true,
            fields: {
              where: {
                visibility: Visibility.Public,
              },
            },
          },
        },
      },
    });

    if (!data) {
      return null;
    }

    return data;
  }

  public async findManyPublic(system: System | string, query?: PaginationQuery): Promise<Member[]> {
    if (!system) return [];

    return await this.findMany({
      where: {
        visibility: Visibility.Public,
        ...this.createSystemQueryPartial(system),
      },
      ...(query ? query : {}),
      include: {
        system: {
          include: {
            user: true,
            fields: true,
          },
        },
      },
    });
  }

  public async countPublic(system: System | string): Promise<number> {
    if (!system) return 0;

    return await this.count({
      where: {
        visibility: Visibility.Public,
        ...this.createSystemQueryPartial(system),
      },
    });
  }

  protected createSystemQueryPartial(systemOrIdentifier: System | string) {
    if (typeof systemOrIdentifier === 'string') {
      return isObjectId(systemOrIdentifier)
        ? { systemId: systemOrIdentifier }
        : { system: { slug: systemOrIdentifier } };
    }

    return { systemId: systemOrIdentifier.id };
  }
}
