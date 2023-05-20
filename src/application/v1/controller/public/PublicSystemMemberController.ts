import { Controller, Get, Param } from '@nestjs/common';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { Ok, Status } from '@app/v1/dto/Status';
import { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { SystemRepository } from '@domain/system/SystemRepository';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse';
import { assignSystem } from '@domain/common';
import { InvalidRequestException } from '@app/v1/exception/InvalidRequestException';
import { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';

@Controller({
  path: '/public/system/:systemId/members',
  version: '1',
})
export class PublicSystemMemberController {
  constructor(private system: SystemRepository, private member: MemberRepository, private plural: PluralRestService) {}

  @Get('/')
  public async list(@Param('id') systemId: string): Promise<Ok<SystemMembersResponse>> {
    // Query system once instead of multiple times for each member
    const system = await this.system.findPublic(systemId);
    if (!system) throw new ResourceNotFoundException();

    const members = (await this.member.findManyPublic(systemId)).map(m => assignSystem(m, system));
    const plurals = await Promise.all(members.map(m => this.plural.findMember(m)));

    return Status.ok(
      new SystemMembersResponse(
        members
          .map(member =>
            UserMemberDto.from(
              member,
              plurals.find(p => p.id === member.pluralId)
            )
          )
          .filter(v => !!v)
      )
    );
  }

  @Get('/:memberId')
  public async view(
    @Param('systemId') systemId: string,
    @Param('memberId') memberId: string
  ): Promise<Ok<SystemMemberResponse>> {
    const member = await this.member.findPublic(memberId, systemId);

    if (!member) {
      throw new ResourceNotFoundException();
    }

    const plural = await this.plural.findMember(member);

    if (!plural) {
      throw new InvalidRequestException();
    }

    return Status.ok({
      member: UserMemberDto.from(member, plural),
    });
  }
}
