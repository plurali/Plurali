import axios, { AxiosResponse } from 'axios';
import { clearFlashes, flash, FlashType } from '../store';
import { SuccessResponse, ErrorResponse, Response, SuccessData } from '@plurali/backend/src/server/status';
import { $topbar } from '../utils/topbar';

export const $axios = axios.create({
  baseURL: (import.meta as any).env?.DEV ? 'http://rayliliannotraychel.local:3000/v1' : 'https://plurali.icu/api',
  withCredentials: true,
});

export const setAuth = (auth: string) => {
  localStorage.setItem("_plurali_auth", auth);
  $axios.defaults.headers.common.Authorization = `Bearer ${auth}`;
}

const auth = localStorage.getItem("_plurali_auth");
if (auth) {
  setAuth(auth);
}

export const formatError = (e: any) =>
  e?.response?.data?.error ?? e?.message ?? 'Unknown error has occurred. Please try again.';

export const wrapRequest = async <T extends SuccessData = SuccessData>(
  fn: () => Promise<AxiosResponse<Response<T>>> | null
): Promise<T | false> => {
  clearFlashes();

  const promise = fn();
  if (!promise) return false;

  try {
    const res = await $topbar.promised(promise);
    if (!res.data.success) throw new Error(res.data.error);

    const warning = res.data.data.warning;
    if (warning) {
      flash(warning, FlashType.Warning, false, true);
    }

    return res.data.data;
  } catch (e) {
    flash(formatError(e), FlashType.Danger, true);
    return false;
  }
};

// aliases
export type { SuccessResponse, ErrorResponse, Response };
