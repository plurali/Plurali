import { CurrentUser } from '@app/context/auth/CurrentUser';
import { CurrentSystem } from '@app/context/system/CurrentSystem';
import { SystemGuard } from '@app/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { Error, Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import { UpdateSystemRequest } from '@app/v1/dto/user/system/request/UpdateSystemRequest';
import { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse';
import { StatusException } from '@app/v1/exception/StatusException';
import { PluralCachedRestService } from '@domain/plural/PluralCachedRestService';
import { SystemRepository } from '@domain/system/SystemRepository';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BackgroundType, Prisma, System, User, Visibility } from '@prisma/client';

@Controller({
  path: '/',
  version: '1',
})
export class SystemController {
  constructor(
    private readonly systems: SystemRepository,
    private readonly fields: FieldRepository,
    private readonly rest: PluralCachedRestService
  ) {}

  @UseGuards(SystemGuard)
  @Post('/')
  async view(@CurrentSystem() system: System, @CurrentUser() user: User): Promise<Ok<SystemResponse> | Error> {
    return Status.ok(new SystemResponse(await this.makeDto(system, user)));
  }

  @UseGuards(SystemGuard)
  @Post('/')
  async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Body() data: UpdateSystemRequest
  ): Promise<Ok<SystemResponse> | Error> {
    const update: Prisma.SystemUpdateInput = {};

    if (notEmpty(data.visible)) {
      update.visibility = data.visible ? Visibility.Public : Visibility.Private;
    }

    if (data.customDescription !== null) {
      update.description = data.customDescription;
    }

    if (notEmpty(data.backgroundColor)) {
      update.backgroundType = BackgroundType.Color;
      update.backgroundColor = data.backgroundColor;
    }

    if (shouldUpdate(update)) {
      system = await this.systems.update({
        where: {
          id: system.id,
        },
        data: update,
      });
    }

    return Status.ok(new SystemResponse(await this.makeDto(system, user)));
  }

  protected async makeDto(system: System, user: User) {
    const plural = await this.rest.findUser({
      ...system,
      user,
    });

    if (!plural) {
      throw new StatusException(StatusMap.InvalidRequest);
    }

    return SystemDto.from(
      {
        ...system,
        fields: await this.fields.findMany({
          where: {
            system,
          },
        }),
      },
      plural
    );
  }
}
