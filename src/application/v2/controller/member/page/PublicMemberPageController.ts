import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member, OwnerType, Page, Visibility } from '@prisma/client';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { PageRepository } from '@domain/page/PageRepository';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { BaseController } from '../../BaseController';

@Controller({
  path: '/public/system/:system/member/:member/page',
  version: '2',
})
@ApiTags('MemberPagePublic')
export class PublicMemberPageController extends BaseController {
  constructor(
    private readonly pages: PageRepository,
    private readonly members: MemberRepository,
  ) {
    super();
  }

  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [PageDto]))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  async list(
    @Param('system') systemId: string,
    @Param('member') memberId: string,
  ): Promise<ApiDataResponse<PageDto[]>> {
    const member = await this.findMemberOrFail(systemId, memberId);

    const pages = await this.pages.findMany({
      where: {
        ownerId: member.id,
        ownerType: OwnerType.Member,
        visibility: Visibility.Public,
      },
    });

    return this.data(pages.map(PageDto.from));
  }

  @Get('/:page')
  @HttpCode(200)
  @ApiResponse(ok(200, PageDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  async view(
    @Param('system') systemId: string,
    @Param('member') memberId: string,
    @Param('page') id: string,
  ): Promise<ApiDataResponse<PageDto>> {
    return this.data(PageDto.from(await this.findOrFail(await this.findMemberOrFail(systemId, memberId), id)));
  }

  protected async findMemberOrFail(systemId: string, memberId: string): Promise<Member> {
    const member = await this.members.findPublic(memberId, systemId);

    if (!member) {
      throw new ResourceNotFoundException();
    }

    return member;
  }

  protected async findOrFail(member: Member, id: string): Promise<Page> {
    const page = await this.pages.findForOwner(id, member, OwnerType.Member, {
      visibility: Visibility.Public,
    });

    if (!page) {
      throw new ResourceNotFoundException();
    }

    return page;
  }
}
