import { Controller, Get, Param } from '@nestjs/common';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { Error, Ok, Status, StatusMap as StatusError } from '@app/v1/dto/Status';
import { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { SystemRepository } from '@domain/system/SystemRepository';

@Controller({
  path: '/public/system/:systemId/members',
  version: '1',
})
export class PublicSystemMemberController {
  constructor(private system: SystemRepository, private member: MemberRepository, private plural: PluralRestService) {}

  @Get('/')
  public async list(@Param('id') systemId: string): Promise<Ok<Record<'members', UserMemberDto[]>> | Error> {
    // Query system once instead of multiple times for each member
    const system = await this.system.findPublic(systemId);
    if (!system) return Status.error(StatusError.ResourceNotFound);

    const members = (await this.member.findManyPublic(systemId)).map(member => Object.assign(member, { system }));
    const plurals = await Promise.all(members.map(member => this.plural.findMember(member)));

    return Status.ok({
      members: await members.map(member => UserMemberDto.from(member, plurals.find(p => p.id === member.pluralId))).filter(v => !!v),
    });
  }

  @Get('/:memberId')
  public async view(
    @Param('systemId') systemId: string,
    @Param('memberId') memberId: string
  ): Promise<Ok<Record<'member', UserMemberDto>>> {
    const member = await this.member.findPublic(systemId, memberId);
    const plural = await this.plural.findMember(member);

    return Status.ok({
      member: UserMemberDto.from(member, plural),
    });
  }
}
