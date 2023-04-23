import axios, { AxiosResponse } from 'axios'
import { BaseData } from './index.js'

export const $simplyClient = axios.create({
  baseURL: 'https://api.apparyllis.com:8443',
  headers: {
    Accept: 'application/json',
  },
})

export const createEndpointCall = <T = unknown, D extends BaseData = BaseData>(
  fn: (client: typeof $simplyClient, data: D) => Promise<AxiosResponse<T>>
): ((data: D) => Promise<AxiosResponse<T>>) => {
  return async (data: D) => {
    const client = $simplyClient
    client.defaults.headers.common.Authorization = data.user.pluralKey

    return await fn(client, data)
  }
}