import { Error, Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { AuthRequestBody } from '@app/v1/dto/auth/request/AuthRequestBody';
import { LoginResponse } from '@app/v1/dto/auth/response/LoginResponse';
import { UserDto } from '@app/v1/dto/user/UserDto';
import { UserAuthenticator } from '@domain/security/authenticator/UserAuthenticator';
import { Body, Controller, Inject, Post, Put } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@domain/cache/CacheService';
import { UserRepository } from '@domain/user/UserRepository';
import { Hasher } from '@domain/security/hasher/Hasher';
import { OkResponse } from '@app/v1/dto/OkResponse';
import { JwtData } from '@domain/security/JwtData';
import { Authenticator } from '@domain/security/authenticator/Authenticator';
import { StatusException } from '@app/v1/exception/StatusException';
import { jwtConfig } from '@app/misc/jwt';

@Controller({
  path: '/auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(Authenticator) private readonly authenticator: UserAuthenticator,
    private readonly signer: JwtService,
    private readonly users: UserRepository,
    private readonly hasher: Hasher,
    private readonly cache: CacheService
  ) {}

  @Post('/login')
  public async login(@Body() credentials: AuthRequestBody): Promise<Ok<LoginResponse>> {
    const user = await this.authenticator.attempt(credentials);

    if (!user) {
      throw new StatusException(StatusMap.InvalidCredentials);
    }

    await this.cache.rebuildFor(user);

    return Status.ok(
      new LoginResponse(
        UserDto.from(user),
        await this.signer.signAsync({ ...new JwtData(user.id) }, { secret: jwtConfig.secret })
      )
    );
  }

  @Put('/register')
  public async register(@Body() credentials: AuthRequestBody): Promise<Ok<LoginResponse>> {
    if (!!(await this.users.findUnique({ where: { username: credentials.username } }))) {
      throw new StatusException(StatusMap.UsernameAlreadyUsed);
    }

    await this.users.create({
      data: {
        username: credentials.username,
        passwordHash: this.hasher.hash(credentials.password),
      },
    });

    return await this.login(credentials);
  }

  @Post('/logout')
  public async logout(): Promise<Ok<OkResponse>> {
    return Status.ok(new OkResponse());
  }
}
