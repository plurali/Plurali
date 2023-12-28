import { isObjectId } from '@domain/common';
import { PrismaRepository } from '@infra/prisma/PrismaRepository';
import { Injectable } from '@nestjs/common';
import { OwnerType, System, Prisma, Page, Member } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PageRepository extends PrismaRepository<'page'> {
  constructor(prisma: PrismaService) {
    super('page', prisma);
  }

  public async findByIdentifier(identifier: string, where: Prisma.PageWhereInput = {}): Promise<Page | null> {
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

  public async findAllByOwner(
    owner: System | Member,
    ownerType: OwnerType,
    where: Prisma.PageWhereInput = {},
  ): Promise<Page[]> {
    if (!owner) return [];

    const data = await this.findMany({
      where: {
        ownerType,
        ownerId: owner.id,
        ...where,
      },
    });

    return data;
  }

  public async findForOwner(
    id: string,
    owner: System | Member,
    ownerType: OwnerType,
    where: Prisma.PageWhereInput = {},
  ): Promise<Page | null> {
    if (!id || !owner || !ownerType) return null;

    const data = await this.findByIdentifier(id, {
      ownerType,
      ownerId: owner.id,
      ...where,
    });

    return data;
  }
}
