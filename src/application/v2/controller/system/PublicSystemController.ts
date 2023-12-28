import { Controller, Get, Param } from '@nestjs/common';
import { SystemRepository } from '@domain/system/SystemRepository';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemDto } from '@app/v2/dto/system/SystemDto';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { BaseController } from '../BaseController';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { InvalidRequestException } from '@app/v2/exception/InvalidRequestException';

@Controller({
  path: '/public/system/:system',
  version: '2',
})
@ApiTags('SystemPublic')
@ApiExtraModels(SystemDto)
export class PublicSystemController extends BaseController {
  constructor(
    private system: SystemRepository,
    private plural: PluralRestService,
  ) {
    super();
  }

  @Get('/')
  @ApiResponse(ok(200, SystemDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidRequest))
  public async view(@Param('system') systemId: string): Promise<ApiDataResponse<SystemDto>> {
    const system = await this.system.findPublicBase(systemId, {
      user: true,
    });

    if (!system) {
      throw new ResourceNotFoundException();
    }

    const plural = await this.plural.findUserForId(system.pluralId, system.user.pluralAccessToken);

    if (!plural) {
      throw new InvalidRequestException();
    }

    return this.data(SystemDto.from(system, plural));
  }
}
