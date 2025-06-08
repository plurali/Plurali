import { RequestWithSystem } from "@app/v1/http/RequestWithSystem";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { System } from "@prisma/client";

/**
 * Returns the system for the current user.
 * @deprecated v2
 */
export const CurrentSystem = createParamDecorator((_: unknown, ctx: ExecutionContext): System => {
  const request: RequestWithSystem = ctx.switchToHttp().getRequest();
  return request.system;
});
