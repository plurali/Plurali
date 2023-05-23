import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BackgroundType, Prisma, System, User, Visibility } from '@prisma/client';
import { FileInterceptor, UploadedFile, MemoryStorageFile } from '@blazity/nest-file-fastify';
import * as mime from 'mime-types';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { SystemRepository } from '@domain/system/SystemRepository';
import { StorageService } from '@infra/storage/StorageService';
import { StoragePrefix } from '@infra/storage/StoragePrefix';
import { SystemDto } from '@app/v2/dto/system/SystemDto';
import { SystemGuard } from '@app/v2/context/system/SystemGuard';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { CurrentSystem } from '@app/v2/context/system/CurrentSystem';
import { CurrentUser } from '@app/v2/context/auth/CurrentUser';
import { ApiDataResponse } from '@app/v2/types/response';
import { InvalidRequestException } from '@app/v2/exception/InvalidRequestException';
import { UnsupportedFileException } from '@app/v2/exception/UnsupportedFileException';
import { UploadFailedException } from '@app/v2/exception/UploadFailedException';
import { BaseController } from '../BaseController';
import { ApiWarning } from '@app/v2/dto/response/warning';
import { UpdateSystemRequest } from '@app/v2/dto/system/request/UpdateSystemRequest';

@Controller({
  path: '/system',
  version: '2',
})
@ApiTags('System')
@ApiSecurity('bearer')
@ApiExtraModels(SystemDto)
export class SystemController extends BaseController {
  constructor(
    private readonly systems: SystemRepository,
    private readonly rest: PluralRestService,
    private readonly storage: StorageService
  ) {
    super();
  }

  @UseGuards(SystemGuard)
  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, SystemDto))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async view(@CurrentSystem() system: System, @CurrentUser() user: User): Promise<ApiDataResponse<SystemDto>> {
    return this.data(await this.makeDto(system, user));
  }

  @UseGuards(SystemGuard)
  @Patch('/')
  @HttpCode(200)
  @ApiResponse(ok(200, SystemDto))
  @ApiResponse(error(400, ApiError.InvalidPluralKey))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Body() data: UpdateSystemRequest
  ): Promise<ApiDataResponse<SystemDto>> {
    const update: Prisma.SystemUpdateInput = {};

    if (notEmpty(data.visibility)) {
      update.visibility = Object.values(Visibility).includes(data.visibility) ? data.visibility : Visibility.Private;
    }

    if (data.description !== null) {
      update.description = data.description;
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

    return this.data(await this.makeDto(system, user));
  }

  protected async makeDto(system: System, user: User) {
    const plural = await this.rest.findUserForId(system.pluralId, user.pluralAccessToken);

    if (!plural) {
      throw new InvalidRequestException();
    }

    return SystemDto.from(system, plural);
  }

  @Post('/background')
  @HttpCode(200)
  @UseGuards(SystemGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse(ok(200, SystemDto))
  @ApiResponse(error(400, ApiError.InvalidPluralKey, ApiError.UnsupportedFile, ApiError.UploadFailed))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async updateBackground(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @UploadedFile() file: MemoryStorageFile
  ) {
    if (!file.mimetype.startsWith('image/')) {
      throw new UnsupportedFileException();
    }

    const key = `${StoragePrefix.Userdata}/${user.id}/${system.id}/background.${mime.extension(file.mimetype)}`;

    const result = await this.storage.store(key, file.buffer, true);
    if (!result.ok) {
      throw new UploadFailedException();
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

    return this.data(
      await this.makeDto(system, user),
      200,
      result.cacheFail ? { warning: ApiWarning.CacheDemand } : {}
    );
  }
}
