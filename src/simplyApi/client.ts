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
        client.defaults.headers.common.Authorization = data.key;

        return await fn(client, data)
    };
}
