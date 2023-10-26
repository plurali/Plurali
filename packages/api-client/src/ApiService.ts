import type { AxiosInstance, AxiosError } from 'axios';
import axios from 'axios';
import { TokenStorage, $tokenStorage } from './TokenStorage';
import { ApiErrorResponse } from '@plurali/pluraliapp/src/application/v2/types/response';
import { ApiError, ApiErrorMap, ApiErrorMessage, apiError } from './utils';

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
        type: e?.response?.data?.error?.type ?? e?.error?.type ?? ApiErrorMap.UnknownError,
        message: this.getErrorMessage(e),
      },
      meta: e?.response?.data?.meta ?? e?.meta ?? {},
    };
  }

  public getErrorMessage(e: any | ApiError | AxiosError | ApiErrorResponse): string {
    if (!e || !['object', 'string'].includes(typeof e)) return ApiErrorMessage[apiError(ApiErrorMap.UnknownError)];
    if (typeof e === 'object')
      e = apiError(e?.response?.data?.error?.type ?? e?.error?.type ?? e?.type ?? ApiErrorMap.UnknownError);

    if (e in ApiErrorMessage) {
      return (ApiErrorMessage as any)[e];
    }

    return e;
  }

  public updateAuth() {
    const auth = this.token.get();
    if (auth) {
      this.client.defaults.headers.common.Authorization = `Bearer ${auth}`;
    }
  }
}

export const $api = new ApiService(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://plurali.icu/api', $tokenStorage);
