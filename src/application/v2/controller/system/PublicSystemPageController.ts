import { Ok, Status } from '@app/v1/dto/Status';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { PageResponse } from '@app/v2/dto/page/response/PageResponse';
import { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';
import { PageRepository } from '@domain/page/PageRepository';
import { SystemRepository } from '@domain/system/SystemRepository';
import { Controller, Get, Param } from '@nestjs/common';
import { System, Page, Visibility } from '@prisma/client';

@Controller({
  path: '/public/system/:systemId/page',
  version: '2',
})
export class PublicSystemPageController {
  constructor(private readonly pages: PageRepository, private readonly systems: SystemRepository) {}

  @Get('/')
  async list(@Param('systemId') systemId: string): Promise<Ok<PagesResponse>> {
    const system = await this.findSystemOrFail(systemId);

    const pages = await this.pages.findMany({
      where: {
        ownerId: system.pluralId,
        ownerType: 'System',
        visibility: Visibility.Public,
      },
    });

    return Status.ok(new PagesResponse(pages.map(PageDto.from)));
  }

  @Get('/:id')
  async view(@Param('systemId') systemId: string, @Param('id') id: string): Promise<Ok<PageResponse>> {
    return Status.ok(new PageResponse(PageDto.from(await this.findOrFail(await this.findSystemOrFail(systemId), id))));
  }

  protected async findSystemOrFail(systemId: string): Promise<System> {
    const system = await this.systems.findFirst({
      where: {
        slug: systemId,
      },
    });

    if (!system) {
      throw new ResourceNotFoundException();
    }

    return system;
  }

  protected async findOrFail(system: System, id: string): Promise<Page> {
    const page = await this.pages.findFirst({
      where: {
        id,
        ownerId: system.pluralId,
        ownerType: 'System',
        visibility: Visibility.Public,
      },
    });

    if (!page) {
      throw new ResourceNotFoundException();
    }

    return page;
  }
}
