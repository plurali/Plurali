import { CurrentUser } from '@app/auth/CurrentUser';
import { AuthGuard } from '@app/auth/AuthGuard';
import { Error, Ok, Status } from '@app/v1/dto/Status';
import { UserResponse } from '@app/v1/dto/user/response/UserResponse';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import { UpdateUserRequest } from '@app/v1/dto/user/request/UpdateUserRequest';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { UserRepository } from '@domain/user/UserRepository';
import { notEmpty } from '@app/misc/request';
import { CacheService } from '@domain/cache/CacheService';

@Controller({
  path: '/user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly rest: PluralRestService,
    private readonly cache: CacheService,
    private readonly users: UserRepository
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async me(@CurrentUser() user: User): Promise<Ok<UserResponse>> {
    return Status.ok(new UserResponse(user));
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async update(@CurrentUser() user: User, @Body() data: UpdateUserRequest): Promise<Ok<UserResponse> | Error> {
    const update: Prisma.UserUpdateInput = {};
    let rebuild = false;

    if (notEmpty(data.pluralKey)) {
      update.pluralAccessToken = !!(await this.rest.findUserForId('me', data.pluralKey)) ? data.pluralKey : null;
      rebuild = true;
    }

    if (notEmpty(data.overridePluralId) && user.role === UserRole.Admin) {
      update.pluralOverride = data.overridePluralId;
    }

    if (Object.keys(update).length >= 1) {
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

    return Status.ok(new UserResponse(user));
  }
}
