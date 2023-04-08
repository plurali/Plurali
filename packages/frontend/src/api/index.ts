import axios, { AxiosResponse } from 'axios'
import { clearFlashes, flash, FlashType } from '../store'
import {SuccessResponse, ErrorResponse, Response} from "@plurali/backend/src/server/status"

export const $axios = axios.create({
  baseURL: (import.meta as any).env?.DEV
    ? 'http://rayliliannotraychel.local:3000'
    : 'https://plurali.icu/api',
  withCredentials: true,
})

export const formatError = (e: any) =>
  e?.response?.data?.error ?? e?.message ?? 'Unknown error has occurred. Please try again.'

export const wrapRequest = async <T extends object = object>(
  promise: () => Promise<AxiosResponse<Response<T>>>
): Promise<T | false> => {
  clearFlashes()
  try {
    const res = await promise()
    if (!res.data.success) throw new Error(res.data.error)

    return res.data.data
  } catch (e) {
    flash(formatError(e), FlashType.Danger, true)
    return false
  }
}

// aliases
export type { SuccessResponse, ErrorResponse, Response }