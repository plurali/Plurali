import { User } from '@prisma/client';
import {
  FastifyRequest,
  RouteGenericInterface,
  RawServerBase,
  RawRequestDefaultExpression,
  FastifySchema,
  FastifyTypeProvider,
  ContextConfigDefault,
  FastifyBaseLogger,
} from 'fastify';
import { FastifyRequestType, ResolveFastifyRequestType, FastifyTypeProviderDefault } from 'fastify/types/type-provider';
import { RawServerDefault } from 'fastify/types/utils';

export interface PaginationRequestQuery {
  page?: number;
  take?: number;
}

export interface RequestWithUser<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  SchemaCompiler extends FastifySchema = FastifySchema,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  ContextConfig = ContextConfigDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
  RequestType extends FastifyRequestType = ResolveFastifyRequestType<TypeProvider, SchemaCompiler, RouteGeneric>,
> extends FastifyRequest<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    TypeProvider,
    ContextConfig,
    Logger,
    RequestType
  > {
  user: User;
}

export interface RequestWithSystem<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  SchemaCompiler extends FastifySchema = FastifySchema,
  TypeProvider extends FastifyTypeProvider = FastifyTypeProviderDefault,
  ContextConfig = ContextConfigDefault,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
  RequestType extends FastifyRequestType = ResolveFastifyRequestType<TypeProvider, SchemaCompiler, RouteGeneric>,
> extends RequestWithUser<
    RouteGeneric,
    RawServer,
    RawRequest,
    SchemaCompiler,
    TypeProvider,
    ContextConfig,
    Logger,
    RequestType
  > {
  system: System;
}
