import { Controller, Get, Param } from '@nestjs/common';
import { SystemRepository } from '@domain/system/SystemRepository';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { InvalidRequestException } from '@app/v1/exception/InvalidRequestException';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse';
import { error, ok } from '@app/misc/swagger';

@Controller({
  path: '/public/system',
  version: '1',
})
@ApiTags('SystemPublicV1')
@ApiExtraModels(SystemResponse)
export class PublicSystemController {
  constructor(
    private system: SystemRepository,
    private plural: PluralRestService,
  ) {}

  @Get('/:systemId')
  @ApiResponse(ok(200, SystemResponse))
  @ApiResponse(error(404, StatusMap.ResourceNotFound))
  @ApiResponse(error(400, StatusMap.InvalidRequest))
  public async view(@Param('systemId') id: string): Promise<Ok<SystemResponse>> {
    const system = await this.system.findPublic(id);

    if (!system) {
      throw new ResourceNotFoundException();
    }

    const plural = await this.plural.findUserForId(system.pluralId, system.user.pluralAccessToken);

    if (!plural) {
      throw new InvalidRequestException();
    }

    return Status.ok(new SystemResponse(SystemDto.from(system, plural)));
  }
}
