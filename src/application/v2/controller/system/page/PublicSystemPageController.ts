import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { System, Page, Visibility, OwnerType } from '@prisma/client';
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
  constructor(
    private readonly pages: PageRepository,
    private readonly systems: SystemRepository,
  ) {
    super();
  }

  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [PageDto]))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  async list(@Param('system') systemSlug: string): Promise<ApiDataResponse<PageDto[]>> {
    const system = await this.findSystemOrFail(systemSlug);

    const pages = await this.pages.findAllByOwner(system, OwnerType.System, {
      visibility: Visibility.Public,
    });

    return this.data(pages.map(PageDto.from));
  }

  @Get('/:page')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  async view(@Param('system') systemSlug: string, @Param('page') slug: string): Promise<ApiDataResponse<PageDto>> {
    return this.data(PageDto.from(await this.findOrFail(await this.findSystemOrFail(systemSlug), slug)));
  }

  protected async findSystemOrFail(systemSlug: string): Promise<System> {
    const system = await this.systems.findPublicBase(systemSlug);

    if (!system) {
      throw new ResourceNotFoundException();
    }

    return system;
  }

  protected async findOrFail(system: System, id: string): Promise<Page> {
    const page = await this.pages.findForOwner(id, system, OwnerType.System, {
      visibility: Visibility.Public,
    });

    if (!page) {
      throw new ResourceNotFoundException();
    }

    return page;
  }
}
