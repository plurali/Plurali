import { RequestWithUser } from '@app/v1/http/RequestWithUser';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Page = createParamDecorator((_: unknown, ctx: ExecutionContext): number => {
  const request: RequestWithUser = ctx.switchToHttp().getRequest();

  const query: object = typeof request.query !== 'object' ? { page: 1 } : request.query;

  let page: number = 'page' in query ? Number(query.page) : 1;
  if (typeof page !== 'number' || isNaN(page) || page < 1) page = 1;

  return Math.floor(page);
});
