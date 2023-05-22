import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Member, Page, Prisma, System, User, Visibility } from '@prisma/client';
import { CurrentUser } from '@app/context/auth/CurrentUser';
import { CurrentSystem } from '@app/context/system/CurrentSystem';
import { SystemGuard } from '@app/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { CreatePageRequest } from '@app/v2/dto/page/request/CreatePageRequest';
import { UpdatePageRequest } from '@app/v2/dto/page/request/UpdatePageRequest';
import { ApiError } from '@app/v2/dto/response/errors';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiDataResponse } from '@app/v2/types/response';
import { PageRepository } from '@domain/page/PageRepository';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { BaseController } from '../../BaseController';
import { Ok } from '@app/v2/dto/response/Ok';

@Controller({
  path: '/member/:memberId/page',
  version: '2',
})
@ApiTags('MemberPage')
@ApiSecurity('bearer')
export class MemberPageController extends BaseController {
  constructor(private readonly pages: PageRepository, private readonly members: MemberRepository) {
    super();
  }

  @UseGuards(SystemGuard)
  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [PageDto]))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async list(
    @CurrentSystem() system: System,
    @Param('memberId') memberId: string
  ): Promise<ApiDataResponse<PageDto[]>> {
    const member = await this.findMemberOrFail(system, memberId);

    const pages = await this.pages.findMany({
      where: {
        ownerId: member.pluralId,
        ownerType: 'Member',
      },
    });

    return this.data(pages.map(PageDto.from));
  }

  @UseGuards(SystemGuard)
  @Get('/:id')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async view(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('memberId') memberId: string,
    @Param('id') id: string
  ): Promise<ApiDataResponse<PageDto>> {
    return this.data(PageDto.from(await this.findOrFail(await this.findMemberOrFail(system, memberId), user, id)));
  }

  @UseGuards(SystemGuard)
  @Post('/:id')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() data: UpdatePageRequest
  ): Promise<ApiDataResponse<PageDto>> {
    const member = await this.findMemberOrFail(system, memberId);

    let page = await this.findOrFail(member, user, id);

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

    return this.data(PageDto.from(page));
  }

  @UseGuards(SystemGuard)
  @Delete('/:id')
  @HttpCode(200)
  @ApiResponse(ok(200, Ok))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async delete(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('memberId') memberId: string,
    @Param('id') id: string
  ): Promise<ApiDataResponse<Ok>> {
    const member = await this.findMemberOrFail(system, memberId);

    await this.pages.delete({
      where: {
        id: (await this.findOrFail(member, user, id)).id,
      },
    });

    return this.ok();
  }

  @UseGuards(SystemGuard)
  @Put('/')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async create(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('memberId') memberId: string,
    @Body() data: CreatePageRequest
  ): Promise<ApiDataResponse<PageDto>> {
    const member = await this.findMemberOrFail(system, memberId);

    const page = await this.pages.create({
      data: {
        ownerId: member.pluralId,
        ownerType: 'Member',
        name: data.name,
        content: data.content,
        userId: user.id,
        visibility: data.visible ? Visibility.Public : Visibility.Private,
      },
    });

    return this.data(PageDto.from(page));
  }

  protected async findMemberOrFail(system: System, memberId: string): Promise<Member> {
    const member = await this.members.findFirst({
      where: {
        pluralId: memberId,
        systemId: system.id,
      },
    });

    if (!member) {
      throw new ResourceNotFoundException();
    }

    return member;
  }

  protected async findOrFail(member: Member, user: User, id: string): Promise<Page> {
    const page = await this.pages.findFirst({
      where: {
        id,
        ownerId: member.pluralId,
        ownerType: 'Member',
        userId: user.id,
      },
    });

    if (!page) {
      throw new ResourceNotFoundException();
    }

    return page;
  }
}