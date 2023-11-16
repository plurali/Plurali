import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { System, Visibility } from '@prisma/client';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { ValueFieldDto } from '@app/v2/dto/field/ValueFieldDto';
import { BaseController } from '../../BaseController';
import { CurrentSystem } from '@app/v2/context/system/CurrentSystem';
import { SystemGuard } from '@app/v2/context/system/SystemGuard';

@Controller({
  path: '/member/:member/field',
  version: '2',
})
@ApiTags('MemberField')
@ApiExtraModels(ValueFieldDto)
export class MemberFieldController extends BaseController {
  constructor(
    private member: MemberRepository,
    private plural: PluralRestService,
  ) {
    super();
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(SystemGuard)
  @ApiResponse(ok(200, [ValueFieldDto]))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  @ApiResponse(error(400, ApiError.InvalidRequest, ApiError.InvalidPluralKey))
  public async list(
    @CurrentSystem() system: System,
    @Param('member') memberId: string,
  ): Promise<ApiDataResponse<ValueFieldDto[]>> {
    const member = await this.member.findFirst({
      where: {
        slug: memberId,
        systemId: system.id,
        visibility: Visibility.Public,
        system: {
          visibility: Visibility.Public,
        },
      },
      include: {
        system: {
          include: {
            user: true,
            fields: true,
          },
        },
      },
    });

    if (!member) {
      throw new ResourceNotFoundException();
    }

    const plural = (await this.plural.findMember(member)) ?? { content: { info: {} } };

    return this.data(
      member.system.fields
        .map(f => {
          const value = plural.content.info[f.pluralId];
          return value ? ValueFieldDto.fromValue(f, value) : null;
        })
        .filter(f => !!f),
    );
  }
}
