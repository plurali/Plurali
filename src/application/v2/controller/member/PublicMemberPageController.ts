import { Ok, Status } from '@app/v1/dto/Status';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { PageResponse } from '@app/v2/dto/page/response/PageResponse';
import { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';
import { PageRepository } from '@domain/page/PageRepository';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { Controller, Get, Param } from '@nestjs/common';
import { Member, Page, Visibility } from '@prisma/client';

@Controller({
  path: '/public/member/:memberId/page',
  version: '2',
})
export class PublicMemberPageController {
  constructor(private readonly pages: PageRepository, private readonly members: MemberRepository) {}

  @Get('/')
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
  async view(@Param('memberId') memberId: string, @Param('id') id: string): Promise<Ok<PageResponse>> {
    return Status.ok(new PageResponse(PageDto.from(await this.findOrFail(await this.findMemberOrFail(memberId), id))));
  }

  protected async findMemberOrFail(memberId: string): Promise<Member> {
    const member = await this.members.findFirst({
      where: {
        slug: memberId,
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
