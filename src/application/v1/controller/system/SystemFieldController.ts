import { CurrentSystem } from '@app/context/system/CurrentSystem';
import { SystemGuard } from '@app/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { error, ok } from '@app/misc/swagger';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { UserFieldDto } from '@app/v1/dto/user/field/UserFieldDto';
import { UpdateSystemFieldRequest } from '@app/v1/dto/user/system/request/UpdateSystemFieldRequest';
import { SystemFieldResponse } from '@app/v1/dto/user/system/response/SystemFieldResponse';
import { SystemFieldsResponse } from '@app/v1/dto/user/system/response/SystemFieldsResponse';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Field, Prisma, System, Visibility } from '@prisma/client';

@Controller({
  path: '/system/fields',
  version: '1',
})
@ApiTags('SystemFieldV1')
@ApiSecurity('bearer')
@ApiExtraModels(SystemFieldResponse, SystemFieldsResponse)
export class SystemFieldController {
  constructor(private readonly fields: FieldRepository) {}

  @UseGuards(SystemGuard)
  @Get('/')
  @ApiResponse(ok(200, SystemFieldsResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async list(@CurrentSystem() system: System): Promise<Ok<SystemFieldsResponse>> {
    const fields = await this.fields.findMany({
      where: {
        systemId: system.id,
      },
    });

    return Status.ok(new SystemFieldsResponse(fields.map(UserFieldDto.from)));
  }

  @UseGuards(SystemGuard)
  @Post('/:fieldId')
  @ApiResponse(ok(200, SystemFieldResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async update(
    @CurrentSystem() system: System,
    @Param('fieldId') id: string,
    @Body() data: UpdateSystemFieldRequest
  ): Promise<Ok<SystemFieldResponse>> {
    let field = await this.findOrFail(system, id);
    const update: Prisma.FieldUpdateInput = {};

    if (notEmpty(data.visible)) {
      update.visibility = data.visible ? Visibility.Public : Visibility.Private;
    }

    if (shouldUpdate(update)) {
      field = await this.fields.update({
        where: {
          id: field.id,
        },
        data: update,
      });
    }

    return Status.ok(new SystemFieldResponse(UserFieldDto.from(field)));
  }

  protected async findOrFail(system: System, id: string): Promise<Field> {
    const field = await this.fields.findFirst({
      where: {
        systemId: system.id,
        pluralId: id,
      },
    });

    if (!field) {
      throw new ResourceNotFoundException();
    }

    return field;
  }
}
