import type { ApiError as BaseApiError } from '@app/v2/dto/response/errors';

export const ApiErrorMap = {
  InvalidRequest: 'invalid_req',
  InvalidPluralKey: 'invalid_plural_key',
  NotAuthenticated: 'not_authenticated',
  InvalidCredentials: 'invalid_credentials',
  UsernameTaken: 'username_taken',
  InvalidOverride: 'invalid_override',
  ResourceNotFound: 'resource_not_found',
  Unauthorized: 'unauthorized',
  UnsupportedFile: 'unsupported_file',
  UploadFailed: 'upload_failed',
  UnknownError: 'unknown_error',
};

export type ApiErrorType = typeof ApiErrorMap;

export type ApiError = keyof ApiErrorType;

export const ApiErrorMessage = {
  [ApiErrorMap.InvalidRequest]: 'Failed to process this request',
  [ApiErrorMap.InvalidPluralKey]: 'Invalid or no Simply Plural token has been provided.',
  [ApiErrorMap.NotAuthenticated]: 'You are currently not authenticated',
  [ApiErrorMap.InvalidCredentials]: 'Invalid credentials have been provided',
  [ApiErrorMap.UsernameTaken]: 'The username has already been taken',
  [ApiErrorMap.InvalidOverride]: 'Invalid override ID',
  [ApiErrorMap.ResourceNotFound]: "The page you have requested couldn't be found",
  [ApiErrorMap.Unauthorized]: 'You are not authorized for this action',
  [ApiErrorMap.UnsupportedFile]: 'This file is not supported',
  [ApiErrorMap.UploadFailed]: 'The file upload has failed, please try again',
  [ApiErrorMap.UnknownError]: 'An unknown error has occurred, please try again',
};

export const apiError = (e: string): BaseApiError => {
  return (Object.values(ApiErrorMap).includes(e) ? e : ApiErrorMap.UnknownError) as BaseApiError;
};
