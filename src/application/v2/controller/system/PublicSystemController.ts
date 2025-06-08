import { ApiError } from "@app/v2/dto/response/errors";
import { SystemDto } from "@app/v2/dto/system/SystemDto";
import { InvalidRequestException } from "@app/v2/exception/InvalidRequestException";
import { ResourceNotFoundException } from "@app/v2/exception/ResourceNotFoundException";
import { error, ok } from "@app/v2/misc/swagger";
import { ApiDataResponse } from "@app/v2/types/response";
import { PluralRestService } from "@domain/plural/PluralRestService";
import { SystemRepository } from "@domain/system/SystemRepository";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";

import { BaseController } from "../BaseController";

@Controller({
  path: "/public/system/:system",
  version: "2",
})
@ApiTags("SystemPublic")
@ApiExtraModels(SystemDto)
export class PublicSystemController extends BaseController {
  constructor(
    private system: SystemRepository,
    private plural: PluralRestService,
  ) {
    super();
  }

  @Get("/")
  @ApiResponse(ok(200, SystemDto))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidRequest))
  public async view(@Param("system") systemId: string): Promise<ApiDataResponse<SystemDto>> {
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
