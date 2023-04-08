import Redis from "ioredis";
import {$env} from "../../utils/env";

export const $redis = new Redis({
    host: $env("REDIS_HOST") ?? '127.0.0.1',
    password: $env("REDIS_PASS"),
    enableAutoPipelining: true
});

export const axiosToRedisKey = (key: string) => `plurali:sp:${key}`

export const cache = async <T = {}>(key: string, value: T, expiry = 300): Promise<void> => {
    // TODO expiry
    await $redis.set(`plurali|${key}`, JSON.stringify(value));
}

export const cached = async <T = {}>(key: string): Promise<T|null> => {
    const res = await $redis.get(`plurali|${key}`);
    if (!res) return null;

    return JSON.parse(res) as T;
}