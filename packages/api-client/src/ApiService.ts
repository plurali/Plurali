import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";

import { apiUrl } from "./env";
import { $tokenStorage, TokenStorage } from "./TokenStorage";
import { ApiError, ApiErrorMessage, ApiErrorResponse } from "./types";
import { apiError } from "./utils";

export class ApiService {
  public readonly client: AxiosInstance;

  constructor(
    private _baseUrl: string,
    public readonly token: TokenStorage,
  ) {
    this.client = axios.create({
      baseURL: _baseUrl,
    });

    this.updateAuth();
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  set baseUrl(value: string) {
    this._baseUrl = value;
    this.client.defaults.baseURL = value;
  }

  public handleException(_e: unknown): ApiErrorResponse {
    const e = _e as AxiosError<any>;

    const result: ApiErrorResponse = {
      success: false,
      statusCode: e?.response?.data?.statusCode ?? e?.response?.data?.status ?? e?.response?.status ?? e?.status ?? -1,
      error: {
        type: e?.response?.data?.error?.type ?? (_e as ApiErrorResponse)?.error?.type ?? ApiError.UnknownError,
        message: this.getErrorMessage(e),
      },
      meta: e?.response?.data?.meta ?? (_e as ApiErrorResponse)?.meta ?? {},
    };

    console.log("handleException", { input: e, result });

    return result;
  }

  // fuck me, what kind of state was I in to write this shit
  public getErrorMessage(e: unknown | ApiError | AxiosError | ApiErrorResponse): string {
    // only accept an object or a string
    if (!e || !["object", "string"].includes(typeof e)) return ApiErrorMessage[ApiError.UnknownError];

    if (typeof e === "object") {
      // api v1 error compatibility
      if (typeof (e as AxiosError<{ error?: string }>)?.response?.data?.error === "string") {
        return (e as AxiosError<{ error: string }>).response!.data.error;
      }

      // find error message by it's type
      e = apiError(
        (e as AxiosError<ApiErrorResponse>)?.response?.data?.error?.type ??
          (e as ApiErrorResponse)?.error?.type ??
          (e as ApiErrorResponse["error"])?.type,
      );
    }

    if (typeof e === "string" && e in ApiErrorMessage) {
      return (ApiErrorMessage as any)[e];
    }

    return e;
  }

  public updateAuth(token?: string | null) {
    if (typeof token !== "undefined") {
      this.token.set(token);
    }

    const auth = this.token.get();
    this.client.defaults.headers.common.Authorization = auth ? `Bearer ${auth}` : undefined;
  }
}

export const $api = new ApiService(apiUrl, $tokenStorage);
