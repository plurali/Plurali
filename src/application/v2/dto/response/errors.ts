export enum ApiError {
  InvalidRequest = 'invalid_req',
  InvalidPluralKey = 'invalid_plural_key',
  NotAuthenticated = 'not_authenticated',
  InvalidCredentials = 'invalid_credentials',
  UsernameTaken = 'username_taken',
  InvalidOverride = 'invalid_override',
  ResourceNotFound = 'resource_not_found',
  Unauthorized = 'unauthorized',
  UnsupportedFile = 'unsupported_file',
  UploadFailed = 'upload_failed',
  UnknownError = 'unknown_error',
}

export const ApiErrorMessage: Record<ApiError, string> = {
  [ApiError.InvalidRequest]: 'Failed to process this request',
  [ApiError.InvalidPluralKey]: 'Invalid or no Simply Plural token has been provided.',
  [ApiError.NotAuthenticated]: 'You are currently not authenticated',
  [ApiError.InvalidCredentials]: 'Invalid credentials have been provided',
  [ApiError.UsernameTaken]: 'The username has already been taken',
  [ApiError.InvalidOverride]: 'Invalid override ID',
  [ApiError.ResourceNotFound]: "The page you have requested couldn't be found",
  [ApiError.Unauthorized]: 'You are not authorized for this action',
  [ApiError.UnsupportedFile]: 'This file is not supported',
  [ApiError.UploadFailed]: 'The file upload has failed, please try again',
  [ApiError.UnknownError]: 'An unknown error has occurred, please try again'
};
