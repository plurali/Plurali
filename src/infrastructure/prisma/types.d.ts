import { ExistingProvider, InjectionToken, Provider, Type } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from './PrismaRepository';

export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type PickKeysMatching<T, V> = {
  [key in KeysMatching<T, V>]: V;
};

export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export interface CustomRepositoryProviderOptionsBase<N extends PrismaModelName = PrismaModelName> {
  modelName: N;
  provide?: InjectionToken;
}

export type CustomRepositoryProviderOptions<N extends PrismaModelName = PrismaModelName> =
  | (DistributiveOmit<
      Exclude<Provider<PrismaRepositoryType<N>>, Type | ExistingProvider> | ExistingProvider<PrismaRepository<N>>,
      'provide'
    > &
      CustomRepositoryProviderOptionsBase<N>)
  | Type<PrismaRepository<N>>;

export type ForModuleCustomEntry<N extends PrismaModelName> = CustomRepositoryProviderOptions<N>;

export type ForModuleEntry<N extends PrismaModelName> = N | ForModuleCustomEntry<N>;

export type PrismaRepositoryType<N extends PrismaModelName = PrismaModelName> = PrismaDelegate<N> & {
  modelName: N;
  prisma: PrismaClient;
  new <N extends PrismaModelName>(modelName: N, prisma: PrismaClient): PrismaRepositoryType<N>;
};

export type PrismaModelName<M = any> = KeysMatching<
  PrismaClient,
  { create(args: { data: any }): ReturnType<Prisma.PrismaPromise<M>['then']> }
>;

export type PrismaDelegate<N extends PrismaModelName> = PrismaClient[N];

// Args meaning the 'args' argument of actions
export type PrismaDelegateFuncArgs<N extends PrismaModelName, F extends keyof PrismaDelegate<N>> = Parameters<
  PrismaDelegate<N>[F]
>[0];

export type PrismaTx = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];
