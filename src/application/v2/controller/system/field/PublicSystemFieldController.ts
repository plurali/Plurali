import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { SystemRepository } from '@domain/system/SystemRepository';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { BaseController } from '../../BaseController';
import { FieldDto } from '@app/v2/dto/field/FieldDto';

@Controller({
  path: '/public/system/:system/field',
  version: '2',
})
@ApiTags('SystemFieldPublic')
@ApiExtraModels(FieldDto)
export class PublicSystemFieldController extends BaseController {
  constructor(private system: SystemRepository, private plural: PluralRestService) {
    super();
  }

  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [FieldDto]))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidRequest))
  public async list(@Param('system') systemId: string): Promise<ApiDataResponse<FieldDto[]>> {
    const system = await this.system.findPublicBase(systemId, { fields: true });

    if (!system) {
      throw new ResourceNotFoundException();
    }

    return this.data((system.fields ?? []).map(field => FieldDto.from(field)));
  }
}
