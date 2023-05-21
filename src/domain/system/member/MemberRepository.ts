import { MemberWithSystem, SystemWithFields, SystemWithUser } from '@domain/common/types';
import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { Member, System, Visibility } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MemberRepository extends PrismaRepository<'member'> {
  constructor(prisma: PrismaService) {
    super('member', prisma);
  }

  public async findPublic(slug: string, system: System): Promise<MemberWithSystem<SystemWithUser & SystemWithFields>> {
    if (!slug || !system) return null;

    const data = await this.findFirst({
      where: {
        slug,
        visibility: Visibility.Public,
        systemId: system.id,
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

  public async findManyPublic(system: System): Promise<Member[]> {
    if (!system) return [];

    return await this.findMany({
      where: {
        visibility: Visibility.Public,
        systemId: system.id,
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
