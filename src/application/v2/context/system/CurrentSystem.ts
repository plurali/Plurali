import { RequestWithSystem } from '@app/v2/types/request';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { System } from '@prisma/client';

/**
 * Returns the system for the current user.
 */
export const CurrentSystem = createParamDecorator((_: unknown, ctx: ExecutionContext): System => {
  const request: RequestWithSystem = ctx.switchToHttp().getRequest();
  return request.system;
});
