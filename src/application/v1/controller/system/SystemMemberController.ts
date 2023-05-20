import { CurrentUser } from '@app/context/auth/CurrentUser';
import { CurrentSystem } from '@app/context/system/CurrentSystem';
import { SystemGuard } from '@app/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { Error, Ok, Status } from '@app/v1/dto/Status';
import { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { UpdateSystemMemberRequest } from '@app/v1/dto/user/system/request/UpdateSystemMemberRequest';
import { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';
import { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse';
import { InvalidRequestException } from '@app/v1/exception/InvalidRequestException';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { assignFields, assignSystem, assignUser } from '@domain/common';
import { SystemWithFields, SystemWithUser } from '@domain/common/types';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { PluralMemberEntry } from '@domain/plural/types/rest/members';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BackgroundType, Member, Prisma, System, User, Visibility } from '@prisma/client';

@Controller({
  path: '/system/members',
  version: '1',
})
export class SystemMemberController {
  constructor(
    private readonly members: MemberRepository,
    private readonly fields: FieldRepository,
    private readonly rest: PluralRestService
  ) {}

  @UseGuards(SystemGuard)
  @Get('/')
  public async list(
    @CurrentSystem() system: System,
    @CurrentUser() user: User
  ): Promise<Ok<SystemMembersResponse>> {
    const members = await this.members.findMany({
      where: {
        systemId: system.id,
      },
    });

    const extendedSystem = await this.makeExtendedSystem(system, user);

    const plural = await this.rest.findMembers(extendedSystem);

    const dtoMembers: UserMemberDto[] = [];

    for (const member of members) {
      const dto = await this.makeDto(member, extendedSystem, plural);

      dtoMembers.push(dto);
    }

    return Status.ok(new SystemMembersResponse(dtoMembers));
  }

  @UseGuards(SystemGuard)
  @Get('/:id')
  public async view(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string
  ): Promise<Ok<SystemMemberResponse>> {
    return Status.ok(
      new SystemMemberResponse(
        await this.makeDto(await this.findOrFail(system, id), await this.makeExtendedSystem(system, user))
      )
    );
  }

  @UseGuards(SystemGuard)
  @Post('/:id')
  public async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateSystemMemberRequest
  ): Promise<Ok<SystemMemberResponse>> {
    let member = await this.findOrFail(system, id);

    const update: Prisma.MemberUpdateInput = {};

    if (notEmpty(data.visible)) {
      update.visibility = data.visible ? Visibility.Public : Visibility.Private;
    }

    if (data.customDescription !== null) {
      update.description = data.customDescription;
    }

    if (notEmpty(data.backgroundColor)) {
      update.backgroundType = BackgroundType.Color;
      update.backgroundColor = data.backgroundColor;
    }

    if (shouldUpdate(update)) {
      member = await this.members.update({
        where: {
          id: member.id,
        },
        data: update,
      });
    }

    return Status.ok(new SystemMemberResponse(await this.makeDto(member, await this.makeExtendedSystem(system, user))));
  }

  protected async findOrFail(system: System, id: string): Promise<Member> {
    const member = await this.members.findFirst({
      where: {
        systemId: system.id,
        pluralId: id,
      },
    });

    if (!member) {
      throw new ResourceNotFoundException();
    }

    return member;
  }

  protected async makeExtendedSystem(system: System, user: User): Promise<SystemWithFields & SystemWithUser> {
    return assignFields(
      assignUser(system, user),
      await this.fields.findMany({
        where: {
          systemId: system.id,
        },
      })
    );
  }

  protected async makeDto(
    member: Member,
    system: SystemWithFields & SystemWithUser,
    plural?: PluralMemberEntry[]
  ): Promise<UserMemberDto> {
    const extendedMember = assignSystem(member, system);

    let pluralMember = plural ? plural.find(m => m.id === member.pluralId) : null;
    if (!pluralMember) {
      // Attempt to fetch alone
      pluralMember = await this.rest.findMember(extendedMember);

      if (!pluralMember) {
        throw new InvalidRequestException();
      }
    }

    return UserMemberDto.from(extendedMember, pluralMember);
  }
}
