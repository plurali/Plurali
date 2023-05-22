import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { System, Page, Visibility } from '@prisma/client';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { PageRepository } from '@domain/page/PageRepository';
import { SystemRepository } from '@domain/system/SystemRepository';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { BaseController } from '../../BaseController';

@Controller({
  path: '/public/system/:system/page',
  version: '2',
})
@ApiTags('SystemPagePublic')
export class PublicSystemPageController extends BaseController {
  constructor(private readonly pages: PageRepository, private readonly systems: SystemRepository) {
    super();
  }

  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [PageDto]))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  async list(@Param('system') systemId: string): Promise<ApiDataResponse<PageDto[]>> {
    const system = await this.findSystemOrFail(systemId);

    const pages = await this.pages.findMany({
      where: {
        ownerId: system.pluralId,
        ownerType: 'System',
        visibility: Visibility.Public,
      },
    });

    return this.data(pages.map(PageDto.from));
  }

  @Get('/:page')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  async view(@Param('system') systemId: string, @Param('page') pageId: string): Promise<ApiDataResponse<PageDto>> {
    return this.data(PageDto.from(await this.findOrFail(await this.findSystemOrFail(systemId), pageId)));
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
