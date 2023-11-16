import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheNamespace } from './utils.js';
import { RedisStore } from 'cache-manager-ioredis-yet';
import { LazyCachedResult } from './types.js';

@Injectable()
export class CacheRepository {
  constructor(@Inject(CACHE_MANAGER) readonly cache: Cache<RedisStore>) {}

  public static createKey<N extends CacheNamespace, K extends string>(ns: N, k: K): `${N}__${K}` {
    return `${ns}__${k}`;
  }

  public async find<T = object>(namespace: CacheNamespace, key: string): Promise<T | null> {
    const data = await this.cache.get<string>(CacheRepository.createKey(namespace, key));
    return data ? (JSON.parse(data) as T) : null;
  }

  public async store<T = object>(
    namespace: CacheNamespace,
    key: string,
    value: T,
    expiry: number | null = 30000,
  ): Promise<void> {
    await this.cache.set(CacheRepository.createKey(namespace, key), JSON.stringify(value), expiry);
  }

  public async delete(namespace: CacheNamespace, key: string): Promise<void> {
    await this.cache.del(CacheRepository.createKey(namespace, key));
  }

  public async lazy<T = object>(
    namespace: CacheNamespace,
    key: string,
    hotData: () => Promise<T>,
    expiry = 30000,
    storeHotData: (
      this: CacheRepository,
      data: T,
      namespace: CacheNamespace,
      key: string,
      expiry: number,
    ) => Promise<T> = async function (d, ns, k, e) {
      await this.store(ns, k, d, e);
      return d;
    },
  ): Promise<LazyCachedResult<T>> {
    const cacheData = await this.find<T>(namespace, key);
    return {
      hot: !!cacheData,
      data: cacheData ? cacheData : await storeHotData.bind(this)(await hotData(), namespace, key, expiry),
    };
  }
}
