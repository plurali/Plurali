import { Body, Controller, Get, HttpCode, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { BaseController } from '../../BaseController';
import { FieldDto } from '@app/v2/dto/field/FieldDto';
import { SystemGuard } from '@app/v2/context/system/SystemGuard';
import { CurrentSystem } from '@app/v2/context/system/CurrentSystem';
import { Prisma, System } from '@prisma/client';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { UpdateFieldRequest } from '@app/v2/dto/field/request/UpdateFieldRequest';

@Controller({
  path: '/system/field',
  version: '2',
})
@ApiTags('SystemField')
@ApiExtraModels(FieldDto)
export class SystemFieldController extends BaseController {
  constructor(private fields: FieldRepository) {
    super();
  }

  @Get('/')
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
    return this.data((fields ?? []).map(field => FieldDto.from(field)));
  }

  @Patch('/:field')
  @HttpCode(200)
  @UseGuards(SystemGuard)
  @ApiResponse(ok(200, FieldDto))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  @ApiResponse(error(400, ApiError.InvalidRequest, ApiError.InvalidPluralKey))
  public async update(
    @CurrentSystem() system: System,
    @Param('field') fieldId: string,
    @Body() data: UpdateFieldRequest,
  ): Promise<ApiDataResponse<FieldDto>> {
    let field = await this.fields.findFirst({
      where: {
        systemId: system.id,
        pluralId: fieldId,
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
