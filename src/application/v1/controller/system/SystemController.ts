import { CurrentUser } from '@app/v1/context/auth/CurrentUser';
import { CurrentSystem } from '@app/v1/context/system/CurrentSystem';
import { SystemGuard } from '@app/v1/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import { UpdateSystemRequest } from '@app/v1/dto/user/system/request/UpdateSystemRequest';
import { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse';
import { StatusException } from '@app/v1/exception/StatusException';
import { assignFields } from '@domain/common';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { SystemRepository } from '@domain/system/SystemRepository';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BackgroundType, Prisma, System, User, Visibility } from '@prisma/client';
import { FileInterceptor, UploadedFile, MemoryStorageFile } from '@blazity/nest-file-fastify';
import { StorageService } from '@infra/storage/StorageService';
import { UnsupportedFileException } from '@app/v1/exception/UnsupportedFileException';
import { StoragePrefix } from '@infra/storage/StoragePrefix';
import { FileProcessingFailedException } from '@app/v1/exception/FileProcessingFailedException';
import * as mime from 'mime-types';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { error, ok } from '@app/v1/misc/swagger';

@Controller({
  path: '/system',
  version: '1',
})
@ApiTags('SystemV1')
@ApiSecurity('bearer')
@ApiExtraModels(SystemResponse)
export class SystemController {
  constructor(
    private readonly systems: SystemRepository,
    private readonly fields: FieldRepository,
    private readonly rest: PluralRestService,
    private readonly storage: StorageService,
  ) {}

  @UseGuards(SystemGuard)
  @Get('/')
  @ApiResponse(ok(200, SystemResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async view(@CurrentSystem() system: System, @CurrentUser() user: User): Promise<Ok<SystemResponse>> {
    return Status.ok(new SystemResponse(await this.makeDto(system, user)));
  }

  @UseGuards(SystemGuard)
  @Post('/')
  @ApiResponse(ok(200, SystemResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Body() data: UpdateSystemRequest,
  ): Promise<Ok<SystemResponse>> {
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
    const plural = await this.rest.findUserForId(system.pluralId, user.pluralAccessToken);

    if (!plural) {
      throw new StatusException(StatusMap.InvalidRequest);
    }

    const fields = await this.fields.findMany({
      where: {
        systemId: system.id,
      },
    });

    return SystemDto.from(assignFields(system, fields), plural);
  }

  @Post('/background')
  @UseGuards(SystemGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse(ok(200, SystemResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey, StatusMap.UnsupportedFile, StatusMap.FileProcessingFailed))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async updateBackground(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @UploadedFile() file: MemoryStorageFile,
  ) {
    if (!file.mimetype.startsWith('image/')) {
      throw new UnsupportedFileException();
    }

    const key = `${StoragePrefix.Userdata}/${user.id}/${system.id}/background.${mime.extension(file.mimetype)}`;

    const result = await this.storage.store(key, file.buffer, true);
    if (!result.ok) {
      throw new FileProcessingFailedException();
    }

    system = await this.systems.update({
      where: {
        id: system.id,
      },
      data: {
        backgroundType: BackgroundType.Image,
        backgroundImage: key,
        assetsUpdatedAt: new Date(),
      },
    });

    const warning = result.cacheFail ? StatusMap.CacheDemand : undefined;

    return Status.ok(new SystemResponse(await this.makeDto(system, user), warning));
  }
}
