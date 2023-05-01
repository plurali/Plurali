import { MemberWithSystem, SystemWithFields, SystemWithUser } from '@domain/common/types';
import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { Member, Visibility } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MemberRepository extends PrismaRepository<'member'> {
  constructor(prisma: PrismaService) {
    super('member', prisma);
  }

  public findPublic(slug: string, systemSlug: string): Promise<MemberWithSystem<SystemWithUser & SystemWithFields>> {
    return this.findFirst({
      where: {
        slug,
        visibility: Visibility.Public,
        system: {
          slug: systemSlug,
        },
      },
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

  public findManyPublic(systemSlug: string): Promise<Member[]> {
    return this.findMany({
      where: {
        visibility: Visibility.Public,
        system: {
          slug: systemSlug,
        },
      },
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
}
