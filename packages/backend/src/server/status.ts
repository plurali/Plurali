export const Status = {
  InvalidRequest: 'Invalid request',
  InvalidPluralKey: 'Invalid plural key',
  NotAuthenticated: 'Not authenticated',
  PluralKeyNotSpecified: 'Plural key not specified',
  Login: {
    InvalidCredentials: 'Invalid credentials',
  },
  Register: {
    UsernameAlreadyUsed: 'Username is already used',
  },
  UserUpdate: {
    InvalidOverride: 'Invalid Override Plural ID',
  },
  ResourceNotFound: 'Resource not found',
  Unauthorized: 'Unauthorized',
  UnsupportedFile: 'Unsupported or invalid file given',
  FileProcessingFailed: 'Failed to process the given file',
  MultipartEndpoint: 'This endpoint is only accepting requests in the multipart form',
  CacheDemand: 'Due to unexpected higher demand, we were not able to clear cached content, so your changes may not be visible immediately.'
}

export interface SuccessData {
  warning?: string
}

export interface SuccessResponse<TData extends SuccessData = SuccessData> {
  success: true
  data: TData
}

export interface ErrorResponse {
  success: false
  error: string
}

export type Response<TData extends SuccessData> = SuccessResponse<TData> | ErrorResponse

export const error = (error: string): ErrorResponse => ({
  success: false,
  error,
})

export const data = <TData extends object>(data: TData): SuccessResponse<TData> => ({
  success: true,
  data,
})
