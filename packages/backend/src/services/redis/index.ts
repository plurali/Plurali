import { Redis, ChainableCommander } from 'ioredis';
import { $env } from '../../utils/env.js';

export const $redis = new Redis({
  host: $env('REDIS_HOST') ?? '127.0.0.1',
  password: $env('REDIS_PASS'),
  enableAutoPipelining: true,
});

export const fullKey = (key: string) => `plurali|${key}`;

export enum CacheStore {
  System = 'PluraliCachedSys',
  Member = 'PluraliCachedSysMem',
  MemberList = 'PluraliCachedSysMemList',
}

export const createKey = <S extends CacheStore, K extends string>(s: S, k: K): `${S}__${K}` => `${s}__${k}`;

export const cache = async <T = {}>(
  store: CacheStore,
  key: string,
  value: T,
  expiry: number | null = 300,
  transaction?: ChainableCommander
): Promise<void> => {
  const t = transaction ?? $redis.multi();

  key = createKey(store, key);

  if (await $redis.exists(key)) {
    t.del(key);
  }

  t.set(key, JSON.stringify(value));

  if (expiry) {
    if (expiry < 1) {
      throw new Error('Expiry must be at least 1');
    }
    t.expire(key, expiry);
  }

  if (!transaction) {
    await t.exec();
  }
};

export const uncache = async (store: CacheStore, key: string, transaction?: ChainableCommander): Promise<void> => {
  const t = transaction ?? $redis.multi();

  await t.del(createKey(store, key));

  if (!transaction) {
    await t.exec();
  }
};

export const cached = async <T = {}>(store: CacheStore, key: string): Promise<T | null> => {
  const res = await $redis.get(createKey(store, key));
  if (!res) return null;

  return JSON.parse(res) as T;
};
