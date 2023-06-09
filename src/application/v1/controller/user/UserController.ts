import { CurrentUser } from '@app/context/auth/CurrentUser';
import { AuthGuard } from '@app/context/auth/AuthGuard';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { UserResponse } from '@app/v1/dto/user/response/UserResponse';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import { UpdateUserRequest } from '@app/v1/dto/user/request/UpdateUserRequest';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { UserRepository } from '@domain/user/UserRepository';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { CacheService } from '@domain/cache/CacheService';
import { UserDto } from '@app/v1/dto/user/UserDto';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { error, ok } from '@app/misc/swagger';

@Controller({
  path: '/user',
  version: '1',
})
@ApiTags('UserV1')
@ApiSecurity('bearer')
@ApiExtraModels(UserResponse)
export class UserController {
  constructor(
    @Inject('PluralRestServiceBase') private readonly rest: PluralRestService,
    private readonly cache: CacheService,
    private readonly users: UserRepository
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  @ApiResponse(ok(200, UserResponse))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async me(@CurrentUser() user: User): Promise<Ok<UserResponse>> {
    return Status.ok(new UserResponse(UserDto.from(user)));
  }

  @UseGuards(AuthGuard)
  @Post('/')
  @ApiResponse(ok(200, UserResponse))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async update(@CurrentUser() user: User, @Body() data: UpdateUserRequest): Promise<Ok<UserResponse>> {
    const update: Prisma.UserUpdateInput = {};
    let rebuild = false;

    if (notEmpty(data.pluralKey)) {
      const plural = await this.rest.findUserForId('me', data.pluralKey);
      update.pluralAccessToken = !!plural ? data.pluralKey : null;
      rebuild = true;
    }

    if (notEmpty(data.overridePluralId) && user.role === UserRole.Admin) {
      update.pluralOverride = data.overridePluralId;
    }

    if (shouldUpdate(update)) {
      user = await this.users.update({
        where: {
          id: user.id,
        },
        data: update,
      });
    }

    if (rebuild) {
      await this.cache.rebuildFor(user);
    }

    return Status.ok(new UserResponse(UserDto.from(user)));
  }
}
