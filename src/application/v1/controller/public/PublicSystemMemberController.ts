import { Controller, Get, Param } from '@nestjs/common';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { SystemRepository } from '@domain/system/SystemRepository';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse';
import { assignSystem } from '@domain/common';
import { InvalidRequestException } from '@app/v1/exception/InvalidRequestException';
import { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { error, ok } from '@app/misc/swagger';
import { Member } from '@prisma/client';
import { SystemWithFields, SystemWithUser } from '@domain/common/types';
import { PluralMemberEntry } from '@domain/plural/types/rest/members';

@Controller({
  path: '/public/system/:systemId/members',
  version: '1',
})
@ApiTags('SystemMemberPublic')
@ApiExtraModels(SystemMembersResponse, SystemMemberResponse)
export class PublicSystemMemberController {
  constructor(private system: SystemRepository, private member: MemberRepository, private plural: PluralRestService) {}

  @Get('/')
  @ApiResponse(ok(200, SystemMembersResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  public async list(@Param('systemId') systemId: string): Promise<Ok<SystemMembersResponse>> {
    // Query system once instead of multiple times for each member
    const system = await this.system.findPublic(systemId);
    if (!system) throw new ResourceNotFoundException();

    const plural = await this.plural.findMembers(system);

    const dtoMembers: UserMemberDto[] = [];

    for (const member of system.members) {
      const dto = await this.makeDto(member, system, plural);

      dtoMembers.push(dto);
    }

    return Status.ok(new SystemMembersResponse(dtoMembers));
  }

  @Get('/:memberId')
  @ApiResponse(ok(200, SystemMemberResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  @ApiResponse(error(400, StatusMap.InvalidRequest))
  public async view(
    @Param('systemId') systemId: string,
    @Param('memberId') memberId: string
  ): Promise<Ok<SystemMemberResponse>> {
    const system = await this.system.findPublic(systemId);
    if (!system) throw new ResourceNotFoundException();

    const member = await this.member.findPublic(memberId, system);

    if (!member) {
      throw new ResourceNotFoundException();
    }

    return Status.ok({
      member: await this.makeDto(member, system, []),
    });
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
      pluralMember = await this.plural.findMember(extendedMember);

      if (!pluralMember) {
        throw new InvalidRequestException();
      }
    }

    return UserMemberDto.from(extendedMember, pluralMember);
  }
}
