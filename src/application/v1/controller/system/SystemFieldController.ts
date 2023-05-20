import { CurrentSystem } from '@app/context/system/CurrentSystem';
import { SystemGuard } from '@app/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { Error, Ok, Status } from '@app/v1/dto/Status';
import { UserFieldDto } from '@app/v1/dto/user/field/UserFieldDto';
import { UpdateSystemFieldRequest } from '@app/v1/dto/user/system/request/UpdateSystemFieldRequest';
import { SystemFieldResponse } from '@app/v1/dto/user/system/response/SystemFieldResponse';
import { SystemFieldsResponse } from '@app/v1/dto/user/system/response/SystemFieldsResponse';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Field, Prisma, System, Visibility } from '@prisma/client';

@Controller({
  path: '/system/fields',
  version: '1',
})
export class SystemFieldController {
  constructor(private readonly fields: FieldRepository) {}

  @UseGuards(SystemGuard)
  @Get('/')
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
  async update(
    @CurrentSystem() system: System,
    @Param('fieldId') id: string,
    @Body() data: UpdateSystemFieldRequest
  ): Promise<Ok<SystemFieldResponse>> {
    let field = await this.findOrThrow(system, id);
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

  protected async findOrThrow(system: System, id: string): Promise<Field> {
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
