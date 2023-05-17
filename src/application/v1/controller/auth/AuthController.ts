import { Error, Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { AuthRequestBody } from '@app/v1/dto/auth/request/AuthRequestBody';
import { LoginResponse } from '@app/v1/dto/auth/response/LoginResponse';
import { UserDto } from '@app/v1/dto/user/UserDto';
import { UserAuthenticator } from '@domain/security/authenticator/UserAuthenticator';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@domain/cache/CacheService';
import { SystemRepository } from '@domain/system/SystemRepository';
import { UserRepository } from '@domain/user/UserRepository';
import { Hasher } from '@domain/security/hasher/Hasher';
import { OkResponse } from '@app/v1/dto/OkResponse';
import { JwtData } from '@domain/security/JwtData';

@Controller({
  path: '/auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authenticator: UserAuthenticator,
    private readonly signer: JwtService,
    private readonly systems: SystemRepository,
    private readonly users: UserRepository,
    private readonly hasher: Hasher,
    private readonly cache: CacheService
  ) {}

  @Post('/login')
  public async login(@Body() credentials: AuthRequestBody): Promise<Ok<LoginResponse> | Error> {
    const user = await this.authenticator.attempt(credentials);

    if (!user) {
      return Status.error(StatusMap.InvalidCredentials);
    }

    await this.cache.rebuildFor(user);

    return Status.ok(new LoginResponse(UserDto.from(user), await this.signer.signAsync(new JwtData(user.id))));
  }

  @Post('/register')
  public async register(@Body() credentials: AuthRequestBody): Promise<Ok<LoginResponse> | Error> {
    if (!(await this.users.findUnique({ where: { username: credentials.username } }))) {
      return Status.error(StatusMap.UsernameAlreadyUsed);
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
