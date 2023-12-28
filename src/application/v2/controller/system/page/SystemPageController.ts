import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { OwnerType, Page, Prisma, System, User } from '@prisma/client';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { error, ok } from '@app/v2/misc/swagger';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { CreatePageRequest } from '@app/v2/dto/page/request/CreatePageRequest';
import { UpdatePageRequest } from '@app/v2/dto/page/request/UpdatePageRequest';
import { PageRepository } from '@domain/page/PageRepository';
import { ApiDataResponse } from '@app/v2/types/response';
import { ApiError } from '@app/v2/dto/response/errors';
import { Ok } from '@app/v2/dto/response/Ok';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { SystemGuard } from '@app/v2/context/system/SystemGuard';
import { CurrentSystem } from '@app/v2/context/system/CurrentSystem';
import { CurrentUser } from '@app/v2/context/auth/CurrentUser';
import { BaseController } from '../../BaseController';
import { createSlug } from '@domain/common';

@Controller({
  path: '/system/page',
  version: '2',
})
@ApiTags('SystemPage')
@ApiSecurity('bearer')
export class SystemPageController extends BaseController {
  constructor(private readonly pages: PageRepository) {
    super();
  }

  @UseGuards(SystemGuard)
  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [PageDto]))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async list(@CurrentSystem() system: System): Promise<ApiDataResponse<PageDto[]>> {
    const pages = await this.pages.findAllByOwner(system, OwnerType.System);

    return this.data(pages.map(PageDto.from));
  }

  @UseGuards(SystemGuard)
  @Get('/:page')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async view(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('page') id: string,
  ): Promise<ApiDataResponse<PageDto>> {
    return this.data(PageDto.from(await this.findOrFail(system, user, id)));
  }

  @UseGuards(SystemGuard)
  @Patch('/:page')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('page') id: string,
    @Body() data: UpdatePageRequest,
  ): Promise<ApiDataResponse<PageDto>> {
    let page = await this.findOrFail(system, user, id);

    const update: Prisma.PageUpdateInput = {};

    if (notEmpty(data.name) && page.name !== data.name) {
      update.name = data.name;
      update.slug = createSlug(data.name);
    }

    if (notEmpty(data.content)) {
      update.content = data.content;
    }

    if (notEmpty(data.visibility)) {
      update.visibility = data.visibility;
    }

    if (shouldUpdate(data)) {
      page = await this.pages.update({
        where: {
          id: page.id,
        },
        data: update,
      });
    }

    return this.data(PageDto.from(page));
  }

  @UseGuards(SystemGuard)
  @Delete('/:page')
  @HttpCode(200)
  @ApiResponse(ok(200, Ok))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async delete(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('page') id: string,
  ): Promise<ApiDataResponse<Ok>> {
    await this.pages.delete({
      where: {
        id: (await this.findOrFail(system, user, id)).id,
      },
    });

    return this.ok();
  }

  @UseGuards(SystemGuard)
  @Put('/')
  @HttpCode(200)
  async create(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Body() data: CreatePageRequest,
  ): Promise<ApiDataResponse<PageDto>> {
    const page = await this.pages.create({
      data: {
        ownerId: system.id,
        ownerType: OwnerType.System,
        name: data.name,
        content: data.content,
        userId: user.id,
        slug: createSlug(data.name),
        visibility: data.visibility,
      },
    });

    return this.data(PageDto.from(page));
  }

  protected async findOrFail(system: System, user: User, id: string): Promise<Page> {
    const page = await this.pages.findForOwner(id, system, OwnerType.System, {
      userId: user.id,
    });

    if (!page) {
      throw new ResourceNotFoundException();
    }

    return page;
  }
}
