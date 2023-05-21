import type { Error, Status, SuccessData } from '@app/v1/dto/Status';
import type { AxiosResponse, AxiosInstance } from 'axios';
import type { TokenStorage } from './TokenStorage';
import axios from 'axios';
import { $topbar } from '../topbar';
import { $tokenStorage } from './TokenStorage';
import { ApiErrorResponse } from './types';

export class ApiService {
  public readonly client: AxiosInstance;

  constructor(public readonly baseUrl: string, public readonly token: TokenStorage) {
    this.client = axios.create({
      baseURL: baseUrl,
    });
  }

  public handleException(error: any): ApiErrorResponse {
    return {
      success: false,
      error: this.formatError(error),
    };
  }

  public updateAuth() {
    const auth = this.token.get();
    if (auth) {
      this.client.defaults.headers.common.Authorization = `Bearer ${auth}`;
    }
  }

  public formatError(e: any): string {
    return e?.response?.data?.error ?? e?.message ?? 'Unknown error has occurred. Please try again.';
  }

  public async wrapRequest<T extends object = SuccessData>(
    fn: () => Promise<AxiosResponse<Status<T>>> | null
  ): Promise<T | false> {
    // clearFlashes();

    const promise = fn();
    if (!promise) return false;

    try {
      const res = await $topbar.promised(promise);
      if (!res.data.success) throw new Error(res.data.error);

      if ('warning' in res.data.data) {
        // flash(String(res.data.data.warning), FlashType.Warning, false, true);
      }

      return res.data.data;
    } catch (e) {
      //   flash(formatError(e), FlashType.Danger, true);
      return false;
    }
  }
}

export const $api = new ApiService(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://plurali.icu/api', $tokenStorage);
