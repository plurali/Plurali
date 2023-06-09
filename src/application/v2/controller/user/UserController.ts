import { Body, Controller, Get, HttpCode, Inject, Patch, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Prisma, User, UserRole } from '@prisma/client';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { UserRepository } from '@domain/user/UserRepository';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { CacheService } from '@domain/cache/CacheService';
import { UserDto } from '@app/v2/dto/user/UserDto';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { UnauthorizedException } from '@app/v2/exception/UnauthorizedException';
import { UpdateUserRequest } from '@app/v2/dto/user/request/UpdateUserRequest';
import { BaseController } from '../BaseController';
import { AuthGuard } from '@app/v2/context/auth/AuthGuard';
import { CurrentUser } from '@app/v2/context/auth/CurrentUser';

@Controller({
  path: '/user',
  version: '2',
})
@ApiTags('User')
@ApiSecurity('bearer')
@ApiExtraModels(UserDto)
export class UserController extends BaseController {
  constructor(
    @Inject('PluralRestServiceBase') private readonly rest: PluralRestService,
    private readonly cache: CacheService,
    private readonly users: UserRepository
  ) {
    super();
  }

  @UseGuards(AuthGuard)
  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, UserDto))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async me(@CurrentUser() user: User): Promise<ApiDataResponse<UserDto>> {
    return this.data(UserDto.from(user));
  }

  @UseGuards(AuthGuard)
  @Patch('/')
  @HttpCode(200)
  @ApiResponse(ok(200, UserDto))
  @ApiResponse(error(401, ApiError.NotAuthenticated, ApiError.Unauthorized))
  async update(@CurrentUser() user: User, @Body() data: UpdateUserRequest): Promise<ApiDataResponse<UserDto>> {
    const update: Prisma.UserUpdateInput = {};
    let clearCache = false;

    if (notEmpty(data.accessToken)) {
      const plural = await this.rest.findUserForId('me', data.accessToken);
      update.pluralAccessToken = !!plural ? data.accessToken : null;
      clearCache = true;
    }

    if (notEmpty(data.systemIdOverride)) {
      if (user.role !== UserRole.Admin) {
        throw new UnauthorizedException();
      }
      update.pluralOverride = data.systemIdOverride;
    }

    if (shouldUpdate(update)) {
      user = await this.users.update({
        where: {
          id: user.id,
        },
        data: update,
      });
    }

    if (clearCache) {
      await this.cache.clearUser(user);
    }

    return this.data(UserDto.from(user));
  }
}
