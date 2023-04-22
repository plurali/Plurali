import * as plural from '@plurali/common/dist/plural'
import { AxiosResponse } from 'axios'
import { CacheStore, cache, cached } from '../services/redis'

export interface CachableResult<TData = any> {
  data: TData
  cached: boolean
}

export const defaultCacheCallback = <T>(
  data: T,
  store: CacheStore,
  key: string,
  expiry: number,
  _cache: typeof cache
) => _cache(store, key, data, expiry)

export const createCachedEndpoint = <T, TA, K extends string>(
  fn: (...args: TA[]) => Promise<AxiosResponse<T>>,
  store: CacheStore,
  key: K | ((...args: TA[]) => K),
  expiry = 300,
  cacheCb: (
    _data: T,
    _store: typeof store,
    _key: K,
    _expiry: typeof expiry,
    _cache: typeof cache,
    ...args: TA[]
  ) => Promise<void> = defaultCacheCallback
): ((...args: TA[]) => Promise<CachableResult<T>>) => {
  return async function (...args: TA[]) {
    key = typeof key === 'function' ? key(...args) : key
    const cachedData = await cached<T>(store, key)

    if (cachedData) {
      return { data: cachedData, cached: true }
    }

    const res = await fn(...args)

    if ([200, 201].includes(res.status) && !!res.data) {
      await cacheCb(res.data, store, key, expiry, cache, ...args)
    }

    return { data: res.data, cached: false }
  }
}

export const getMe = createCachedEndpoint(
  plural.getMe,
  CacheStore.System,
  args => `PluraliUser${args.user.id}_Override${args.user.overridePluralId ?? 'Unset'}`
)

export const getMember = createCachedEndpoint(
  plural.getMember,
  CacheStore.Member,
  args => `PluraliUser${args.user.id}_OwnerSID${args.systemId}_MemberSID${args.memberId}`
)

export const getMembers = createCachedEndpoint(
  plural.getMembers,
  CacheStore.MemberList,
  args => `PluraliUser${args.user.id}_OwnerSID${args.systemId}`,
  300,
  async (members, store, key, expiry, cache) => {
    await cache(store, key, members, expiry)
    for (const member of members) {
      await cache(CacheStore.Member, `${key}_MemberSID${member.id}`, member, expiry)
    }
  }
)
