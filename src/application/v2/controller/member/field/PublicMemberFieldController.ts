import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { Visibility } from '@prisma/client';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { FieldDto } from '@app/v2/dto/field/FieldDto';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { ValueFieldDto } from '@app/v2/dto/field/ValueFieldDto';
import { BaseController } from '../../BaseController';

@Controller({
  path: '/public/member/:member/field',
  version: '2',
})
@ApiTags('MemberFieldPublic')
@ApiExtraModels(FieldDto)
export class PublicMemberFieldController extends BaseController {
  constructor(private member: MemberRepository, private plural: PluralRestService) {
    super();
  }

  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [FieldDto]))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidRequest))
  public async list(@Param('member') memberId: string): Promise<ApiDataResponse<FieldDto[]>> {
    const member = await this.member.findFirst({
      where: {
        slug: memberId,
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
        .filter(f => !!f)
    );
  }
}
