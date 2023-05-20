import { UserRepository } from '@domain/user/UserRepository';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/AuthGuard';
import { SystemRepository } from '@domain/system/SystemRepository';
import { RequestWithUser } from '@app/v1/http/RequestWithUser';
import { StatusException } from '@app/v1/exception/StatusException';
import { StatusMap } from '@app/v1/dto/Status';
import { NotAuthenticatedException } from '@app/v1/exception/NotAuthenticatedException';

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
        throw new StatusException(StatusMap.InvalidPluralKey);
      }

      request['system'] = system;

      return true;
    }

    throw new NotAuthenticatedException();
  }
}
