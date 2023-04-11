import * as plural from '@plurali/common/dist/plural'
import { AxiosResponse } from 'axios'
import { cache, cached } from '../services/redis'

export interface CachableResult<TData = any> {
  data: TData
  cached: boolean
}

export const createCachedEndpoint = <T, TA>(
  fn: (...args: TA[]) => Promise<AxiosResponse<T>>,
  id: string | ((...args: TA[]) => string),
  expiry = 300
): ((...args: TA[]) => Promise<CachableResult<T>>) => {
  return async function (...args: TA[]) {
    /*id = typeof id === 'function' ? id(...args) : id
    const cachedData = await cached<T>(id)

    if (cachedData) {
      return { data: cachedData, cached: true }
    }*/

    try {
      const res = await fn(...args)

      /*if ([200, 201].includes(res.status) && !!res.data) {
        await cache(id, res.data, expiry)
      }*/

      return { data: res.data, cached: false }
    } catch (e) {
      throw e
    }
  }
}

export const getMe = createCachedEndpoint(
  plural.getMe,
  data => `getMe_pluraliUser__{data.user.id}_${data.user.overridePluralId ?? 'unset'}`
)

export const getUser = createCachedEndpoint(plural.getUser, data => `getUser_${data.user}`)

export const getMember = createCachedEndpoint(
  plural.getMember,
  data => `getMember_pluraliUser__${data.user.id}_${data.systemId}_${data.memberId}`
)

export const getMembers = createCachedEndpoint(plural.getMembers, data => `getMembers_pluraliUser__${data.user.id}_${data.systemId}`)
