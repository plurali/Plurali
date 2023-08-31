import { Body, Controller, Get, HttpCode, Inject, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Prisma, User, UserRole, UserVerificationType } from '@prisma/client';
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
import { EmailAlreadyUsedException } from '@app/v2/exception/EmailAlreadyUsedException';
import { UserService } from '@domain/user/UserService';
import { SystemRepository } from '@domain/system/SystemRepository';
import { SystemAlreadyAssociatedException } from '@app/v2/exception/SystemAlreadyAssociatedException';
import { Ok } from '@app/v2/dto/response/Ok';
import { UserVerificationRepository } from '@domain/user/verification/UserVerificationRepository';
import { InvalidVerificationException } from '@app/v2/exception/InvalidVerificationException';
import { VerifyUserEmailRequest } from '@app/v2/dto/user/request/VerifyUserEmailRequest';
import {ObjectId} from 'bson';

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
    private readonly userService: UserService,
    private readonly users: UserRepository,
    private readonly systems: SystemRepository,
    private readonly verifications: UserVerificationRepository,
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
  @ApiResponse(error(401, ApiError.NotAuthenticated, ApiError.Unauthorized, ApiError.SystemAlreadyAssociated))
  async update(@CurrentUser() user: User, @Body() data: UpdateUserRequest): Promise<ApiDataResponse<UserDto>> {
    const update: Prisma.UserUpdateInput = {};
    let clearCache = false;

    if (notEmpty(data.accessToken)) {
      const plural = await this.rest.findUserForId('me', data.accessToken);

      if (plural) {
        const alreadyAssociated = !!(await this.systems.findUnique({
          where: {
            pluralId: plural.id,
            NOT: {
              userId: user.id
            }
          }
        }));

        if (alreadyAssociated) {
          throw new SystemAlreadyAssociatedException();
        }
      }

      update.pluralAccessToken = !!plural ? data.accessToken : null;
      clearCache = true;
    }

    if (notEmpty(data.systemIdOverride)) {
      if (user.role !== UserRole.Admin) {
        throw new UnauthorizedException();
      }
      update.pluralOverride = data.systemIdOverride;
    }

    if (notEmpty(data.email) && user.email !== data.email) {
      if (await this.users.emailExists(data.email)) {
        throw new EmailAlreadyUsedException();
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

    if (clearCache) {
      await this.cache.clearUser(user);
    }

    return this.data(UserDto.from(user));
  }

  @UseGuards(AuthGuard)
  @Post('/verify-email')
  @ApiResponse(ok(200, UserDto))
  @ApiResponse(error(401, ApiError.NotAuthenticated, ApiError.InvalidVerification))
  async verifyEmail(@CurrentUser() user: User, @Body() { code }: VerifyUserEmailRequest): Promise<ApiDataResponse<Ok>> {
    if (!ObjectId.isValid(code)) {
      throw new InvalidVerificationException();
    }

    const verification = await this.verifications.findFirst({
      where: {
        id: code,
        type: UserVerificationType.Email,
        userId: user.id
      }
    })

    if (!verification) {
      throw new InvalidVerificationException();
    }

    await this.users.update({
      where: {
        id: user.id
      },
      data: {
        email: user.email, // ensure another email isn't saved on parallel
        emailVerified: true,
      }
    })

    return this.ok();
  }
}
