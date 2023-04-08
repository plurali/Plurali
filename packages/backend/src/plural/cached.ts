import * as plural from '@plurali/common/dist/plural'
import { AxiosResponse } from 'axios'
import { cache, cached } from '../services/redis'

export const createCachedEndpoint = <T, TA = any>(
  fn: (...args: TA[]) => Promise<AxiosResponse<T>>,
  id: string | ((...args: TA[]) => string),
  expiry = 300
  //   wrapped as .data to prevent workarounds for everything consuming axiosResponse.data
): ((...args: TA[]) => Promise<{ data: T }>) => {
  return async function (...args: TA[]) {
    id = typeof id === 'function' ? id(...args) : id
    const cachedData = await cached<T>(id)

    if (cachedData) {
        console.log(`${id} is cached!`)
      return { data: cachedData }
    }

    try {
      const res = await fn(...args)

      if ([200, 201].includes(res.status) && !!res.data) {
        await cache(id, res.data, expiry)
      }

      return { data: res.data }
    } catch (e) {
      throw e
    }
  }
}

export const getMe = createCachedEndpoint(
  plural.getMe,
  data => `@getMe|::${data.user.id}::|overridePluralId=${data.user.overridePluralId ?? 'unset'}`
)

export const getUser = createCachedEndpoint(plural.getUser, data => `@getUser|::${data.user}:::`)

export const getMember = createCachedEndpoint(
  plural.getMember,
  data => `@getMember|::${data.user.id}::|system=${data.systemId},queryMember=${data.memberId}`
)

export const getMembers = createCachedEndpoint(
  plural.getMembers,
  data => `@getMembers|::${data.user.id}::|system=${data.systemId}`
)
