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
import { StatusException } from '@app/v1/exception/StatusException';
import { UserService } from '@domain/user/UserService';
import { SystemAlreadyAssociatedException } from '@app/v1/exception/SystemAlreadyAssociatedException';
import { SystemRepository } from '@domain/system/SystemRepository';

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
    private readonly userService: UserService,
    private readonly users: UserRepository,
    private readonly systems: SystemRepository
  ) { }

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
  @ApiResponse(error(401, StatusMap.NotAuthenticated, StatusMap.SystemAlreadyAssociated))
  async update(@CurrentUser() user: User, @Body() data: UpdateUserRequest): Promise<Ok<UserResponse>> {
    const update: Prisma.UserUpdateInput = {};
    let rebuild = false;

    if (notEmpty(data.pluralKey)) {
      const plural = await this.rest.findUserForId('me', data.pluralKey);

      if (plural) {
        const alreadyAssociated = !!(await this.systems.findUnique({
          where: {
            pluralId: plural.id
          }
        }));

        if (alreadyAssociated) {
          throw new SystemAlreadyAssociatedException();
        }
      }

      update.pluralAccessToken = !!plural ? data.pluralKey : null;
      rebuild = true;
    }

    if (notEmpty(data.overridePluralId) && user.role === UserRole.Admin) {
      update.pluralOverride = data.overridePluralId;
    }

    if (notEmpty(data.email) && user.email !== data.email) {
      if (await this.users.emailExists(data.email)) {
        throw new StatusException(StatusMap.EmailTaken);
      }

      update.email = data.email;
      update.emailVerified = false;

      await this.userService.sendVerificationEmail(user, update.email);
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
