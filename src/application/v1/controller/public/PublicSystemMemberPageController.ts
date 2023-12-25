import { error, ok } from '@app/v1/misc/swagger';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { PageDto } from '@app/v1/dto/page/PageDto';
import { PageResponse } from '@app/v1/dto/page/response/PageResponse';
import { PagesResponse } from '@app/v1/dto/page/response/PagesResponse';
import { PageRepository } from '@domain/page/PageRepository';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member, Page, Visibility } from '@prisma/client';

@Controller({
  path: '/public/member/:memberId/page',
  version: '1',
})
@ApiTags('SystemMemberPagePublicV1')
@ApiExtraModels(PageResponse, PagesResponse)
export class PublicSystemMemberPageController {
  constructor(
    private readonly pages: PageRepository,
    private readonly members: MemberRepository,
  ) {}

  @Get('/')
  @ApiResponse(ok(200, PagesResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  async list(@Param('memberId') memberId: string): Promise<Ok<PagesResponse>> {
    const member = await this.findMemberOrFail(memberId);

    const pages = await this.pages.findMany({
      where: {
        ownerId: member.pluralId,
        ownerType: 'Member',
        visibility: Visibility.Public,
      },
    });

    return Status.ok(new PagesResponse(pages.map(PageDto.from)));
  }

  @Get('/:id')
  @ApiResponse(ok(200, PageResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  async view(@Param('memberId') memberId: string, @Param('id') id: string): Promise<Ok<PageResponse>> {
    return Status.ok(new PageResponse(PageDto.from(await this.findOrFail(await this.findMemberOrFail(memberId), id))));
  }

  protected async findMemberOrFail(memberId: string): Promise<Member> {
    const member = await this.members.findFirst({
      where: {
        slug: memberId,
        visibility: Visibility.Public,
      },
    });

    if (!member) {
      throw new ResourceNotFoundException();
    }

    return member;
  }

  protected async findOrFail(member: Member, id: string): Promise<Page> {
    const page = await this.pages.findFirst({
      where: {
        id,
        ownerId: member.pluralId,
        ownerType: 'Member',
        visibility: Visibility.Public,
      },
    });

    if (!page) {
      throw new ResourceNotFoundException();
    }

    return page;
  }
}
