import { RequestWithUser } from '@app/v2/http/RequestWithUser';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Take = createParamDecorator((_: unknown, ctx: ExecutionContext): number => {
  const request: RequestWithUser = ctx.switchToHttp().getRequest();

  const query: object = typeof request.query !== 'object' ? { take: 20 } : request.query;

  let take: number = 'take' in query ? Number(query.take) : 20;
  if (typeof take !== 'number' || isNaN(take) || take < 20) take = 20;

  return Math.floor(take);
});
