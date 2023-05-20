import { CurrentUser } from '@app/context/auth/CurrentUser';
import { CurrentSystem } from '@app/context/system/CurrentSystem';
import { SystemGuard } from '@app/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { OkResponse } from '@app/v1/dto/OkResponse';
import { Ok, Status } from '@app/v1/dto/Status';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { CreatePageRequest } from '@app/v2/dto/page/request/CreatePageRequest';
import { UpdatePageRequest } from '@app/v2/dto/page/request/UpdatePageRequest';
import { PageResponse } from '@app/v2/dto/page/response/PageResponse';
import { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';
import { PageRepository } from '@domain/page/PageRepository';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Member, Page, Prisma, System, User, Visibility } from '@prisma/client';

@Controller({
  path: '/member/:memberId/page',
  version: '2',
})
export class MemberPageController {
  constructor(private readonly pages: PageRepository, private readonly members: MemberRepository) {}

  @UseGuards(SystemGuard)
  @Get('/')
  async list(@CurrentSystem() system: System, @Param('memberId') memberId: string): Promise<Ok<PagesResponse>> {
    const member = await this.findMemberOrFail(system, memberId);

    const pages = await this.pages.findMany({
      where: {
        ownerId: member.pluralId,
        ownerType: 'Member',
      },
    });

    return Status.ok(new PagesResponse(pages.map(PageDto.from)));
  }

  @UseGuards(SystemGuard)
  @Get('/:id')
  async view(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('memberId') memberId: string,
    @Param('id') id: string
  ): Promise<Ok<PageResponse>> {
    return Status.ok(
      new PageResponse(PageDto.from(await this.findOrFail(await this.findMemberOrFail(system, memberId), user, id)))
    );
  }

  @UseGuards(SystemGuard)
  @Post('/:id')
  async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() data: UpdatePageRequest
  ): Promise<Ok<PageResponse>> {
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

    return Status.ok(new PageResponse(PageDto.from(page)));
  }

  @UseGuards(SystemGuard)
  @Delete('/:id')
  async delete(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('memberId') memberId: string,
    @Param('id') id: string
  ): Promise<Ok<OkResponse>> {
    const member = await this.findMemberOrFail(system, memberId);

    await this.pages.delete({
      where: {
        id: (await this.findOrFail(member, user, id)).id,
      },
    });

    return Status.ok(new OkResponse());
  }

  @UseGuards(SystemGuard)
  @Put('/')
  async create(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('memberId') memberId: string,
    @Body() data: CreatePageRequest
  ): Promise<Ok<PageResponse>> {
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

    return Status.ok(new PageResponse(PageDto.from(page)));
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
