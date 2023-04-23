import * as plural from '@plurali/common/dist/plural/index.js';
import { AxiosResponse } from 'axios';
import { $redis, CacheStore, cache, cached } from '../services/redis/index.js';
import { ChainableCommander } from 'ioredis';
import { $server } from '../server/index.js';

export interface CachableResult<TData = any> {
  data: TData;
  cached: boolean;
}

export const defaultCacheCallback = async <T>(
  data: T,
  store: CacheStore,
  key: string,
  expiry: number,
  _cache: typeof cache,
  transaction: ChainableCommander
) => await _cache(store, key, data, expiry, transaction);

export const createCachedEndpoint = <T, A, K extends string>(
  fn: (args: A) => Promise<AxiosResponse<T>>,
  store: CacheStore,
  _key: K | ((args: A) => K),
  expiry = 3000,
  cacheCb: (
    _data: T,
    _store: typeof store,
    _key: K,
    _expiry: typeof expiry,
    _cache: typeof cache,
    transaction: ChainableCommander,
    args: A
  ) => Promise<void> = defaultCacheCallback
): ((args: A, transaction?: ChainableCommander) => Promise<CachableResult<T>>) => {
  return async function (args: A, transaction?: ChainableCommander) {
    const key = typeof _key === 'function' ? _key(args) : _key;
    const cachedData = await cached<T>(store, key);

    if (cachedData) {
      $server.log.info(`[cache] resolved cached data for ${store} with key '${key}'`)
      return { data: cachedData, cached: true };
    }

    $server.log.info(`[cache] fetching hot data for ${store} with key '${key}'`)
    const res = await fn(args);

    if ([200, 201].includes(res.status) && !!res.data) {
      const t = transaction ?? $redis.multi();

      await cacheCb(res.data, store, key, expiry, cache, t, args);

      if (!transaction) {
        await t.exec();
      }
    }

    return { data: res.data, cached: false };
  }; 
};

export const getMe = createCachedEndpoint(
  plural.getMe,
  CacheStore.System,
  args => `PluraliUser${args.user.id}_Override${args.user.overridePluralId ?? 'Unset'}`
);

export const getMember = createCachedEndpoint(
  plural.getMember,
  CacheStore.Member,
  args => `PluraliUser${args.user.id}_OwnerSID${args.systemId}_MemberSID${args.memberId}`
);

export const getMembers = createCachedEndpoint(
  plural.getMembers,
  CacheStore.MemberList,
  args => `PluraliUser${args.user.id}_OwnerSID${args.systemId}`,
  3000,
  async (members, store, key, expiry, cache, transaction) => {
    await cache(store, key, members, expiry, transaction);
    for (const member of members) {
      await cache(CacheStore.Member, `${key}_MemberSID${member.id}`, member, expiry, transaction);
    }
  }
);
