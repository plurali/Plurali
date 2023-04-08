import axios, {AxiosInstance, AxiosResponse} from "axios";
import {BaseData} from ".";

/*
import {buildStorage, CachedStorageValue, canStale, setupCache} from "axios-cache-interceptor";
import {$redis, axiosToRedisKey} from "../redis";
    // TODO: Cache requests from Apparyllis API to Redis in production
  const redisStorage = buildStorage({
    async find(key) {
        const result = await $redis.get(axiosToRedisKey(key));
        return JSON.parse(result);
    },

    async set(key, value) {
        await $redis.set(axiosToRedisKey(key), JSON.stringify(value));
    },

    async remove(key) {
        await $redis.del(axiosToRedisKey(key));
    }
});

let $simplyClient = setupCache(axios.create({
    baseURL: "https://api.apparyllis.com:8443",
    headers: {
        Accept: 'application/json'
    }
}), {
    storage: redisStorage,
})
*/


let $simplyClient = axios.create({
    baseURL: "https://api.apparyllis.com:8443",
    headers: {
        Accept: 'application/json'
    }
});


export const createEndpointCall = <T = unknown, D extends BaseData = BaseData>(
    fn: (client: typeof $simplyClient, data: D) => Promise<AxiosResponse<T>>
): (data: D) => Promise<AxiosResponse<T>> => {
    return async (data: D) => {
        const client = $simplyClient;
        client.defaults.headers.common.Authorization = data.user.pluralKey;

        return await fn($simplyClient, data)
    };
}

export const testKey = async (key: string): Promise<boolean> => {
    try {
        await $simplyClient.request({
            method: "GET",
            url: "/v1/me",
            headers: {
                Authorization: key
            },
        })
        return true;
    } catch (_) {
        return false;
    }
}

export {$simplyClient}