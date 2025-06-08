import { notEmpty, shouldUpdate } from "@app/misc/request";
import { CurrentSystem } from "@app/v2/context/system/CurrentSystem";
import { SystemGuard } from "@app/v2/context/system/SystemGuard";
import { FieldDto } from "@app/v2/dto/field/FieldDto";
import { UpdateFieldRequest } from "@app/v2/dto/field/request/UpdateFieldRequest";
import { ApiError } from "@app/v2/dto/response/errors";
import { ResourceNotFoundException } from "@app/v2/exception/ResourceNotFoundException";
import { error, ok } from "@app/v2/misc/swagger";
import { ApiDataResponse } from "@app/v2/types/response";
import { FieldRepository } from "@domain/system/field/FieldRepository";
import { Body, Controller, Get, HttpCode, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Prisma, System } from "@prisma/client";

import { BaseController } from "../../BaseController";

@Controller({
  path: "/system/field",
  version: "2",
})
@ApiTags("SystemField")
@ApiExtraModels(FieldDto)
export class SystemFieldController extends BaseController {
  constructor(private fields: FieldRepository) {
    super();
  }

  @Get("/")
  @HttpCode(200)
  @UseGuards(SystemGuard)
  @ApiResponse(ok(200, [FieldDto]))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  @ApiResponse(error(400, ApiError.InvalidRequest, ApiError.InvalidPluralKey))
  public async list(@CurrentSystem() system: System): Promise<ApiDataResponse<FieldDto[]>> {
    const fields = await this.fields.findMany({
      where: {
        systemId: system.id,
      },
    });
    return this.data((fields ?? []).map((field) => FieldDto.from(field)));
  }

  @Patch("/:field")
  @HttpCode(200)
  @UseGuards(SystemGuard)
  @ApiResponse(ok(200, FieldDto))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  @ApiResponse(error(400, ApiError.InvalidRequest, ApiError.InvalidPluralKey))
  public async update(
    @CurrentSystem() system: System,
    @Param("field") fieldId: string,
    @Body() data: UpdateFieldRequest,
  ): Promise<ApiDataResponse<FieldDto>> {
    let field = await this.fields.findFirst({
      where: {
        id: fieldId,
        systemId: system.id,
      },
    });

    if (!field) {
      throw new ResourceNotFoundException();
    }

    const update: Prisma.FieldUpdateInput = {};

    if (notEmpty(data.visibility)) {
      update.visibility = data.visibility;
    }

    if (shouldUpdate(update)) {
      field = await this.fields.update({
        where: {
          id: field.id,
        },
        data: update,
      });
    }

    return this.data(FieldDto.from(field));
  }
}
