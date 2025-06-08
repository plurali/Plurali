import { FieldDto } from "@app/v2/dto/field/FieldDto";
import { ApiError } from "@app/v2/dto/response/errors";
import { ResourceNotFoundException } from "@app/v2/exception/ResourceNotFoundException";
import { error, ok } from "@app/v2/misc/swagger";
import { ApiDataResponse } from "@app/v2/types/response";
import { SystemRepository } from "@domain/system/SystemRepository";
import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";

import { BaseController } from "../../BaseController";

@Controller({
  path: "/public/system/:system/field",
  version: "2",
})
@ApiTags("SystemFieldPublic")
@ApiExtraModels(FieldDto)
export class PublicSystemFieldController extends BaseController {
  constructor(private system: SystemRepository) {
    super();
  }

  @Get("/")
  @HttpCode(200)
  @ApiResponse(ok(200, [FieldDto]))
  @ApiResponse(error(404, ApiError.ResourceNotFound))
  @ApiResponse(error(400, ApiError.InvalidRequest))
  public async list(@Param("system") systemId: string): Promise<ApiDataResponse<FieldDto[]>> {
    const system = await this.system.findPublicBase(systemId, { fields: true });

    if (!system) {
      throw new ResourceNotFoundException();
    }

    return this.data((system.fields ?? []).map((field) => FieldDto.from(field)));
  }
}
