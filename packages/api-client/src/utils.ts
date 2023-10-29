import { ApiError } from "./types";

export const isBrowser = typeof window !== undefined;

export const apiError = (e?: string|null|false) => {
    if (!e) {
        return ApiError.UnknownError;
    }

    return Object.values(ApiError).includes(e as ApiError) ? e as ApiError : ApiError.UnknownError;
}