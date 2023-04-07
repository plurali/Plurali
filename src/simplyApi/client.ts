import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BaseData } from ".";

export const $simplyClient = axios.create({
    baseURL: "https://api.apparyllis.com:8443",
    headers: {
        Accept: 'application/json'
    }
})

export const createEndpointCall = <T = unknown, D extends BaseData = BaseData>(
    fn: (client: AxiosInstance, data: D) => Promise<AxiosResponse<T>>
): (data: D) => Promise<AxiosResponse<T>>  => {
    return async (data: D) => {
        const client = $simplyClient;
        client.defaults.headers.common.Authorization = data.user.pluralKey;

        return await fn(client, data)
    };
}

export const testKey = async (key: string): Promise<boolean> => {
    try {
        await $simplyClient.request({
            method: "GET",
            url: "/v1/me",
            headers: {
                Authorization: key
            }
        })
        return true;
    } catch (_) {
        return false;
    }
}
