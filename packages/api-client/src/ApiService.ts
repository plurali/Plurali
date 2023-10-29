import type { AxiosInstance, AxiosError } from 'axios';
import axios from 'axios';
import { TokenStorage, $tokenStorage } from './TokenStorage';
import { apiUrl } from './env';
import { ApiError, ApiErrorMessage, ApiErrorResponse } from './types';
import { apiError } from './utils';

export class ApiService {
  public readonly client: AxiosInstance;

  constructor(public readonly baseUrl: string, public readonly token: TokenStorage) {
    this.client = axios.create({
      baseURL: baseUrl,
    });

    this.updateAuth();
  }

  public handleException(e: any): ApiErrorResponse {
    return {
      success: false,
      statusCode: e?.response?.data?.statusCode ?? e?.response?.statusCode ?? e?.statusCode ?? -1,
      error: {
        type: e?.response?.data?.error?.type ?? e?.error?.type ?? ApiError.UnknownError,
        message: this.getErrorMessage(e),
      },
      meta: e?.response?.data?.meta ?? e?.meta ?? {},
    };
  }

  public getErrorMessage(e: any | ApiError | AxiosError | ApiErrorResponse): string {
    if (!e || !['object', 'string'].includes(typeof e)) return ApiErrorMessage[ApiError.UnknownError];
    if (typeof e === 'object')
      e = apiError(e?.response?.data?.error?.type ?? e?.error?.type ?? e?.type);

    if (e in ApiErrorMessage) {
      return (ApiErrorMessage as any)[e];
    }

    return e;
  }

  public updateAuth(token?: string|null) {
    if (typeof token !== "undefined") {
      this.token.set(token);
    }

    const auth = this.token.get();
    if (auth) {
      this.client.defaults.headers.common.Authorization = `Bearer ${auth}`;
    }
  }
}

export const $api = new ApiService(apiUrl, $tokenStorage);
