import KeyvValkey from "@keyv/valkey";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { RedisCommander } from "iovalkey";
import Keyv from "keyv";

import { LazyCachedResult } from "./types.js";
import { CacheNamespace } from "./utils.js";

@Injectable()
export class CacheRepository {
  private _redisStoreIdx: number | null = null;

  constructor(@Inject(CACHE_MANAGER) readonly cache: Cache) {}

  public static createKey<N extends CacheNamespace, K extends string>(ns: N, k: K): `${N}__${K}` {
    return `${ns}__${k}`;
  }

  /**
   * TECHDEBT: This is Redis-specific and may break if we change Keyv stores, hence why marked deprecated
   * @deprecated
   * @throws In case Redis is not present
   */
  public getUnderlyingRedis(): RedisCommander {
    if (this._redisStoreIdx !== null) {
      return (this.cache.stores[this._redisStoreIdx] as Keyv).store.redis as RedisCommander;
    }

    const idx = this.cache.stores.findIndex((keyv) => keyv.store instanceof KeyvValkey);

    if (idx === null) {
      throw new Error("Called getUnderlyingRedis() but Redis store cannot be found");
    }

    this._redisStoreIdx = idx;
    return this.getUnderlyingRedis();
  }

  public async keys(pattern: string): Promise<string[]> {
    const redis = this.getUnderlyingRedis();
    const keys: string[] = [];
    let cursor = "0";

    do {
      const [nextCursor, foundKeys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;
      keys.push(...foundKeys);
    } while (cursor !== "0");

    return keys;
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
