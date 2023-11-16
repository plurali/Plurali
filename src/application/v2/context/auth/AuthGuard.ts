import { jwtConfig } from '@app/misc/jwt';
import { NotAuthenticatedException } from '@app/v2/exception/NotAuthenticatedException';
import { JwtDataInterface } from '@domain/security/JwtData';
import { UserRepository } from '@domain/user/UserRepository';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly signer: JwtService,
    private readonly users: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new NotAuthenticatedException();
    }

    try {
      const payload = await this.signer.verifyAsync<JwtDataInterface>(token, {
        secret: jwtConfig.secret,
      });

      const user = await this.users.findUnique({
        where: {
          id: payload.user,
        },
      });

      if (!user) {
        throw new NotAuthenticatedException();
      }

      request['user'] = user;
    } catch {
      throw new NotAuthenticatedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
