import { RequestWithUser } from '@app/v2/types/request';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';

/**
 * Returns the user for an authenticated request.
 */
export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): User => {
  const request: RequestWithUser = ctx.switchToHttp().getRequest();
  return request.user;
});
