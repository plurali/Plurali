import { CurrentUser } from '@app/v1/context/auth/CurrentUser';
import { CurrentSystem } from '@app/v1/context/system/CurrentSystem';
import { SystemGuard } from '@app/v1/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { error, ok } from '@app/v1/misc/swagger';
import { OkResponse } from '@app/v1/dto/OkResponse';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { PageDto } from '@app/v1/dto/page/PageDto';
import { CreatePageRequest } from '@app/v1/dto/page/request/CreatePageRequest';
import { UpdatePageRequest } from '@app/v1/dto/page/request/UpdatePageRequest';
import { PageResponse } from '@app/v1/dto/page/response/PageResponse';
import { PagesResponse } from '@app/v1/dto/page/response/PagesResponse';
import { PageRepository } from '@domain/page/PageRepository';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Page, Prisma, System, User, Visibility } from '@prisma/client';

@Controller({
  path: '/system/page',
  version: '1',
})
@ApiTags('SystemPageV1')
@ApiSecurity('bearer')
@ApiExtraModels(PageResponse, PagesResponse, OkResponse)
export class SystemPageController {
  constructor(private readonly pages: PageRepository) {}

  @UseGuards(SystemGuard)
  @Get('/')
  @ApiResponse(ok(200, PageResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async list(@CurrentSystem() system: System): Promise<Ok<PagesResponse>> {
    const pages = await this.pages.findMany({
      where: {
        ownerId: system.pluralId,
        ownerType: 'System',
      },
    });

    return Status.ok(new PagesResponse(pages.map(PageDto.from)));
  }

  @UseGuards(SystemGuard)
  @Get('/:id')
  @ApiResponse(ok(200, PageResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async view(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Ok<PageResponse>> {
    return Status.ok(new PageResponse(PageDto.from(await this.findOrFail(system, user, id))));
  }

  @UseGuards(SystemGuard)
  @Post('/:id')
  @ApiResponse(ok(200, PageResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdatePageRequest,
  ): Promise<Ok<PageResponse>> {
    let page = await this.findOrFail(system, user, id);

    const update: Prisma.PageUpdateInput = {};

    if (notEmpty(data.name)) {
      update.name = data.name;
    }

    if (notEmpty(data.content)) {
      update.content = data.content;
    }

    if (notEmpty(data.visible)) {
      update.visibility = data.visible ? Visibility.Public : Visibility.Private;
    }

    if (shouldUpdate(data)) {
      page = await this.pages.update({
        where: {
          id: page.id,
        },
        data: update,
      });
    }

    return Status.ok(new PageResponse(PageDto.from(page)));
  }

  @UseGuards(SystemGuard)
  @Delete('/:id')
  @ApiResponse(ok(200, OkResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async delete(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Ok<OkResponse>> {
    await this.pages.delete({
      where: {
        id: (await this.findOrFail(system, user, id)).id,
      },
    });

    return Status.ok(new OkResponse());
  }

  @UseGuards(SystemGuard)
  @Put('/')
  async create(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Body() data: CreatePageRequest,
  ): Promise<Ok<PageResponse>> {
    const page = await this.pages.create({
      data: {
        ownerId: system.pluralId,
        ownerType: 'System',
        name: data.name,
        content: data.content,
        userId: user.id,
        visibility: data.visible ? Visibility.Public : Visibility.Private,
      },
    });

    return Status.ok(new PageResponse(PageDto.from(page)));
  }

  protected async findOrFail(system: System, user: User, id: string): Promise<Page> {
    const page = await this.pages.findFirst({
      where: {
        id,
        ownerId: system.pluralId,
        ownerType: 'System',
        userId: user.id,
      },
    });

    if (!page) {
      throw new ResourceNotFoundException();
    }

    return page;
  }
}
