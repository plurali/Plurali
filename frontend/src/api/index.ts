import axios, { AxiosResponse } from 'axios';
import { clearFlashes, flash, FlashType } from '../store';
import type { Status, StatusMapType, SuccessData } from '@app/v1/dto/Status';
import { $topbar } from '../utils/topbar';

const baseURL = window.location.href.includes('.local')
  ? 'http://rayliliannotraychel.local:3000'
  : window.location.href.includes('dev.')
  ? 'https://dev.plurali.icu/api'
  : 'https://plurali.icu/api';

export const $axios = axios.create({
  baseURL,
  withCredentials: true,
});

export const setAuth = (auth: string | null) => {
  if (auth) {
    localStorage.setItem('_plurali_auth', auth);
  } else {
    localStorage.removeItem("_plurali_auth");
  }
  $axios.defaults.headers.common.Authorization = `Bearer ${auth}`;
};

const auth = localStorage.getItem('_plurali_auth');
if (auth) {
  setAuth(auth);
}

export const formatError = (e: any) =>
  e?.response?.data?.error ?? e?.message ?? 'Unknown error has occurred. Please try again.';

export const wrapRequest = async <T extends object = SuccessData>(
  fn: () => Promise<AxiosResponse<Status<T>>> | null
): Promise<T | false> => {
  clearFlashes();

  const promise = fn();
  if (!promise) return false;

  try {
    const res = await $topbar.promised(promise);
    if (!res.data.success) throw new Error(res.data.error);

    if ('warning' in res.data.data) {
      flash(String(res.data.data.warning), FlashType.Warning, false, true);
    }

    return res.data.data;
  } catch (e) {
    flash(formatError(e), FlashType.Danger, true);
    return false;
  }
};

// copied so it's values can be used
export const StatusMap = {
  InvalidRequest: 'Invalid request',
  InvalidPluralKey: 'Invalid plural key',
  NotAuthenticated: 'Not authenticated',
  PluralKeyNotSpecified: 'Plural key not specified',
  InvalidCredentials: 'Invalid credentials',
  UsernameAlreadyUsed: 'Username is already used',
  InvalidOverride: 'Invalid Override Plural ID',
  ResourceNotFound: 'Resource not found',
  Unauthorized: 'Unauthorized',
  UnsupportedFile: 'Unsupported or invalid file given',
  FileProcessingFailed: 'Failed to process the given file',
  MultipartEndpoint: 'This endpoint is only accepting requests in the multipart form',
  CacheDemand:
    'Due to unexpected higher demand, we were not able to clear cached content, so your changes may not be visible immediately.',
} as StatusMapType;
