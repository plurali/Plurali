import type { Status, StatusMapType, SuccessData } from "@app/v1/dto/Status";
import { $api, ApiErrorResponse, ApiResponse } from "@plurali/api-client";
import axios, { AxiosResponse } from "axios";

import { clearFlashes, flash, FlashType } from "../store";
import { $topbar } from "../utils/topbar";

const prodApiUrl = "https://api.plurali.icu";

const pubdevApiUrl = "https://pubdev.plurali.icu/api";

const apiUrls = {
  [prodApiUrl]: ["https://plurali.icu", "https://www.plurali.icu"].some((url) => window.location.href.startsWith(url)),
  // [pubdevApiUrl]: window.location.href.startsWith("https://pubdev.plurali.icu"),
  // "https://dev.plurali.icu/api": window.location.href.startsWith("https://dev.plurali.icu"),
  "http://localhost:8000": import.meta.env.DEV,
};

const getApiUrl = () => {
  for (const apiUrl in apiUrls) {
    const matches = apiUrls[apiUrl as keyof typeof apiUrls];
    if (matches) {
      return apiUrl;
    }
  }

  return prodApiUrl;
};

export const baseURL = getApiUrl();

export const isPubDev = baseURL === pubdevApiUrl;

export const $axios = axios.create({
  baseURL,
});

export const setAuth = (auth: string | null) => {
  $api.updateAuth(auth);
  $axios.defaults.headers.common.Authorization = `Bearer ${auth}`;
};

const auth = localStorage.getItem("_plurali_auth");
if (auth) {
  setAuth(auth);
}

/** @deprecated */
export const formatError = (e: unknown) => {
  return $api.handleException(e).error.message;
};

class WrappedRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WrappedRequestError";
  }
}

export const wrapRequest = async <T extends object = SuccessData>(
  fn: () => Promise<AxiosResponse<Status<T>> | ApiResponse<T>> | null,
): Promise<T | false> => {
  clearFlashes();

  const promise = fn();
  if (!promise) return false;

  try {
    const res = await $topbar.promised(promise);

    // support @plurali/api-client as well as standard axios response
    const data = "success" in res ? res : res.data;
    const isApiV2 = "meta" in res;

    if (!data.success) {
      if (isApiV2) {
        throw new WrappedRequestError((data as ApiErrorResponse).error.message);
      }

      // hackaround for 200 errors (should not happen)
      throw new WrappedRequestError($api.handleException({ response: { data } }).error.message);
    }

    if ("warning" in data.data) {
      flash(String(data.data.warning), FlashType.Warning, false, true);
    }

    return data.data;
  } catch (e) {
    const message = e instanceof WrappedRequestError ? e.message : $api.handleException(e).error.message;

    flash(message, FlashType.Danger, true);
    return false;
  }
};

// copied so it's values can be used
export const StatusMap = {
  InvalidRequest: "Invalid request",
  InvalidPluralKey: "Invalid plural key",
  NotAuthenticated: "Not authenticated",
  PluralKeyNotSpecified: "Plural key not specified",
  InvalidCredentials: "Invalid credentials",
  UsernameAlreadyUsed: "Username is already used",
  InvalidOverride: "Invalid Override Plural ID",
  ResourceNotFound: "Resource not found",
  Unauthorized: "Unauthorized",
  UnsupportedFile: "Unsupported or invalid file given",
  FileProcessingFailed: "Failed to process the given file",
  MultipartEndpoint: "This endpoint is only accepting requests in the multipart form",
  CacheDemand:
    "Due to unexpected higher demand, we were not able to clear cached content, so your changes may not be visible immediately.",
} as StatusMapType;
