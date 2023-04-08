/*import Redis from "ioredis";
import {$env} from "../Env";

export const $redis = new Redis({
    host: $env.get("REDIS_HOST", false) ?? '127.0.0.1',
    password: $env.get("REDIS_PASS", false),
    enableAutoPipelining: true
});

export const axiosToRedisKey = (key: string) => `plurali:sp:${key}`


export const cache = async <T = {}>(namespace: string, key: string, value: T, expiry = 300): Promise<string> => {
    // TODO expiry
    const fullKey = `plurali.${namespace}-${key}`;

    await $redis.set(fullKey, JSON.stringify(value));

    return fullKey;
}

export const cached = async <T = {}>(key: string): Promise<T|null> => {
    const res = await $redis.get(key);
    if (!res) return null;

    return JSON.parse(res) as T;
}*/