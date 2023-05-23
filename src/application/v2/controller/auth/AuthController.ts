import { UserAuthenticator } from '@domain/security/authenticator/user/UserAuthenticator';
import { Body, Controller, HttpCode, Inject, Post, Put } from '@nestjs/common';
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
import { UsernameTakenException } from '@app/v2/exception/UsernameTakenException';
import { BaseController } from '../BaseController';

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
    private readonly users: UserRepository,
    private readonly hasher: Hasher,
    private readonly cache: CacheService
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
      new AuthDto(await this.signer.signAsync({ ...new JwtData(user.id) }, { secret: jwtConfig.secret }))
    );
  }

  @Put('/register')
  @HttpCode(200)
  @ApiResponse(ok(200, AuthDto))
  @ApiResponse(error(400, ApiError.UsernameTaken))
  public async register(@Body() credentials: AuthRequest): Promise<ApiDataResponse<AuthDto>> {
    if (await this.users.usernameExists(credentials.username)) {
      throw new UsernameTakenException();
    }

    await this.users.create({
      data: {
        username: credentials.username,
        passwordHash: this.hasher.hash(credentials.password),
      },
    });

    return await this.login(credentials);
  }
}
