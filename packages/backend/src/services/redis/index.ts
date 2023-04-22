import Redis from "ioredis";
import {$env} from "../../utils/env";

export const $redis = new Redis({
    host: $env("REDIS_HOST") ?? '127.0.0.1',
    password: $env("REDIS_PASS"),
    enableAutoPipelining: true
});

export const fullKey = (key: string) => `plurali|${key}`

export enum CacheStore {
    System = "PluraliCachedSys",
    Member = "PluraliCachedSysMem",
    MemberList = "PluraliCachedSysMemList"
}

export const createKey = <S extends CacheStore, K extends string>(s: S, k: K): `${S}__${K}` => `${s}__${k}` 

export const cache = async <T = {}>(store: CacheStore, key: string, value: T, expiry: number|null = 300): Promise<void> => {
    key = createKey(store, key);
    await $redis.set(key, JSON.stringify(value));

    if (expiry) {
        if (expiry < 1) {
            throw new Error("Expiry must be at least 1")
        }
        await $redis.expire(key, expiry)
    }
}

export const uncache = async (store: CacheStore, key: string): Promise<void> => {
    await $redis.del(createKey(store, key));
}

export const cached = async <T = {}>(store: CacheStore, key: string): Promise<T|null> => {
    const res = await $redis.get(createKey(store, key));
    if (!res) return null;

    return JSON.parse(res) as T;
}