import { Controller, Get, HttpCode, Inject, Param } from '@nestjs/common';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { SystemRepository } from '@domain/system/SystemRepository';
import { assignSystem } from '@domain/common';
import { ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member } from '@prisma/client';
import { SystemWithUser } from '@domain/common/types';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse, ApiPaginatedDataResponse } from '@app/v2/types/response';
import { BaseController } from '../BaseController';
import { Page } from '@app/v2/context/pagination/Page';
import { Take } from '@app/v2/context/pagination/Take';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { MemberDto } from '@app/v2/dto/member/MemberDto';
import { InvalidRequestException } from '@app/v2/exception/InvalidRequestException';
import { PluralCachedRestService } from '@domain/plural/PluralCachedRestService';

@Controller({
  path: '/public/system/:system/members',
  version: '2',
})
@ApiTags('MemberPublic')
@ApiExtraModels(MemberDto)
export class PublicMemberController extends BaseController {
  constructor(
    private system: SystemRepository,
    private member: MemberRepository,
    @Inject(PluralRestService) private plural: PluralCachedRestService
  ) {
    super();
  }

  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [MemberDto]))
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1 })
  @ApiQuery({ name: 'take', required: false, type: 'number', example: 20 })
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidRequest))
  public async list(
    @Param('system') systemId: string,
    @Page() page: number,
    @Take() take: number
  ): Promise<ApiPaginatedDataResponse<MemberDto>> {
    const query = this.createPaginationQuery(page, take);

    console.log(query);

    // Query system once instead of multiple times for each member
    const system = await this.system.findPublic(systemId, query);
    if (!system) {
      throw new ResourceNotFoundException();
    }

    return this.paginated(
      await this.makeDtos(system.members, system),
      200,
      query,
      await this.member.countPublic(system)
    );
  }

  @Get('/:memberId')
  @HttpCode(200)
  @ApiResponse(ok(200, MemberDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidRequest))
  public async view(
    @Param('systemId') systemId: string,
    @Param('memberId') memberId: string
  ): Promise<ApiDataResponse<MemberDto>> {
    const system = await this.system.findPublicBase(systemId, {
      user: true,
    });
    if (!system) {
      throw new ResourceNotFoundException();
    }

    const member = await this.member.findPublic(memberId, system);

    if (!member) {
      throw new ResourceNotFoundException();
    }

    return this.data(await this.makeDto(member, system as SystemWithUser));
  }

  protected async makeDto(member: Member, system: SystemWithUser): Promise<MemberDto> {
    const extendedMember = assignSystem(member, system);

    const pluralMember = await this.plural.findMember(extendedMember);
    if (!pluralMember) {
      throw new InvalidRequestException();
    }

    return MemberDto.from(extendedMember, pluralMember);
  }

  protected async makeDtos(members: Member[], system: SystemWithUser): Promise<MemberDto[]> {
    const plurals = await this.plural.findSpecificMembers(system, members);
    return members
      .map(member => {
        const plural = plurals.get(member.pluralId);
        return plural ? MemberDto.from(assignSystem(member, system), plural) : null;
      })
      .filter(m => !!m);
  }
}
