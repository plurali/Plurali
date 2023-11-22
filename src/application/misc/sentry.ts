import { ExecutionContext, HttpException } from '@nestjs/common';
import { Scope } from '@sentry/node';
import { FastifyRequest } from 'fastify';
import { RavenInterceptor } from 'nest-raven';

export const FILTERED_KEYS = ['password', 'email', 'accessToken', 'email'];

export const filterSensitiveData = (data: unknown) => {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  const filteredObj = {};

  for (const key in data) {
    let value = data[key];

    if (value && FILTERED_KEYS.includes(key)) {
      const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

      if (type === 'object') {
        filteredObj[key] = filterSensitiveData(value);
        continue;
      }

      value = `**${type}**`;
    }

    filteredObj[key] = value;
  }

  return filteredObj;
};

export const createSentryInterceptor = () => {
  return new RavenInterceptor({
    level: 'error',
    filters: [
      {
        type: HttpException,
        filter: (exception: HttpException) => {
          const status = exception.getStatus() ?? 500;

          // HTTP status code is higher/equals 400 (with the the exception of 401/403)
          // or is higher/equals 500.
          return (status >= 400 && ![401, 403].includes(status)) || status >= 500;
        },
      },
    ],
    transformers: [
      (scope: Scope, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest<FastifyRequest>();
        scope.setExtras({
          params: filterSensitiveData(req.params),
          query: filterSensitiveData(req.query),
          body: filterSensitiveData(req.body),
          isMultipart: req.isMultipart(),
          headers: req.headers,
          originalurl: req.originalUrl,
          url: req.url,
        });
      },
    ],
  });
};
