import { UserAuthenticator } from '@domain/security/authenticator/user/UserAuthenticator';
import { Body, Controller, Get, HttpCode, Inject, Post, Put, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@domain/cache/CacheService';
import { UserRepository } from '@domain/user/UserRepository';
import { Hasher } from '@domain/security/hasher/Hasher';
import { JwtData } from '@domain/security/JwtData';
import { Authenticator } from '@domain/security/authenticator/Authenticator';
import { jwtConfig } from '@app/misc/jwt';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from '@app/v2/dto/auth/AuthDto';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { AuthRequest } from '@app/v2/dto/auth/request/AuthRequest';
import { InvalidCredentialsException } from '@app/v2/exception/InvalidCredentialsException';
import { UsernameOrEmailTakenException } from '@app/v2/exception/UsernameOrEmailTakenException';
import { BaseController } from '../BaseController';
import { RegisterRequest } from '@app/v2/dto/auth/request/RegisterRequest';
import { UserService } from '@domain/user/UserService';
import { Ok } from '@app/v2/dto/response/Ok';
import { UserVerificationRepository } from '@domain/user/verification/UserVerificationRepository';
import { ResetPasswordRequest } from '@app/v2/dto/auth/request/ResetPasswordRequest';
import { UserVerificationType } from '@prisma/client';
import { InvalidVerificationException } from '@app/v2/exception/InvalidVerificationException';

@Controller({
  path: '/auth',
  version: '2',
})
@ApiTags('Auth')
@ApiExtraModels(AuthDto)
export class AuthController extends BaseController {
  constructor(
    @Inject(Authenticator) private readonly authenticator: UserAuthenticator,
    private readonly signer: JwtService,
    private readonly userService: UserService,
    private readonly users: UserRepository,
    private readonly verifications: UserVerificationRepository,
    private readonly hasher: Hasher,
    private readonly cache: CacheService,
  ) {
    super();
  }

  @Post('/login')
  @HttpCode(200)
  @ApiResponse(ok(200, AuthDto))
  @ApiResponse(error(401, ApiError.InvalidCredentials))
  public async login(@Body() credentials: AuthRequest): Promise<ApiDataResponse<AuthDto>> {
    const user = await this.authenticator.attempt(credentials);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    await this.cache.clearUser(user);

    return this.data(
      new AuthDto(await this.signer.signAsync({ ...new JwtData(user.id) }, { secret: jwtConfig.secret })),
    );
  }

  @Put('/register')
  @HttpCode(200)
  @ApiResponse(ok(200, AuthDto))
  @ApiResponse(error(400, ApiError.UsernameOrEmailTaken))
  public async register(@Body() credentials: RegisterRequest): Promise<ApiDataResponse<AuthDto>> {
    if (
      !!(await this.users.findFirst({
        where: { OR: [{ username: credentials.username }, { email: credentials.email }] },
      }))
    ) {
      throw new UsernameOrEmailTakenException();
    }

    const user = await this.users.create({
      data: {
        username: credentials.username,
        email: credentials.email,
        passwordHash: this.hasher.hash(credentials.password),
      },
    });

    await this.userService.sendVerificationEmail(user);

    return await this.login(credentials);
  }

  @Get('/reset-password')
  @ApiResponse(ok(200, Ok))
  async requestPasswordReset(@Query('email') email: string): Promise<ApiDataResponse<Ok>> {
    const user = await this.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      // Mocks the timeout of sending a password reset email.
      // This is to prevent users from checking if an email is registered for malicious purposes.
      return await new Promise(resolve => setTimeout(() => resolve(this.ok()), 700));
    }

    await this.userService.sendPasswordResetEmail(user);

    return this.ok();
  }

  @Put('/reset-password')
  @ApiResponse(ok(200, Ok))
  @ApiResponse(error(400, ApiError.InvalidVerification))
  async processPasswordReset(@Body() { email, code, password }: ResetPasswordRequest): Promise<ApiDataResponse<Ok>> {
    const user = await this.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new InvalidVerificationException();
    }

    const verification = await this.verifications.findVerification(code, UserVerificationType.PasswordReset, user);

    if (!verification) {
      throw new InvalidVerificationException();
    }

    await this.users.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: this.hasher.hash(password),
      },
    });

    await this.verifications.delete({
      where: {
        id: verification.id,
      },
    });

    return this.ok();
  }
}
