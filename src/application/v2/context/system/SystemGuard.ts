import { UserRepository } from '@domain/user/UserRepository';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/AuthGuard';
import { SystemRepository } from '@domain/system/SystemRepository';
import { RequestWithUser } from '@app/v2/http/RequestWithUser';
import { ApiException } from '@app/v2/exception/ApiException';
import { ApiError } from '@app/v2/dto/response/errors';
import { NotAuthenticatedException } from '@app/v2/exception/NotAuthenticatedException';

@Injectable()
export class SystemGuard extends AuthGuard {
  constructor(signer: JwtService, users: UserRepository, private readonly systems: SystemRepository) {
    super(signer, users);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);

    if (authenticated) {
      const request: RequestWithUser = context.switchToHttp().getRequest();

      const system = await this.systems.findUnique({
        where: {
          userId: request.user.id,
        },
      });

      if (!system) {
        throw new ApiException(ApiError.InvalidPluralKey);
      }

      request['system'] = system;

      return true;
    }

    throw new NotAuthenticatedException();
  }
}
