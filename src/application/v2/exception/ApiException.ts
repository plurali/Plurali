import { HttpException, HttpExceptionOptions } from '@nestjs/common';
import { ApiError, ApiErrorMessage } from '../dto/response/errors';
import { ApiErrorResponse, ApiResponseMeta } from '../types/response';

export class ApiException extends HttpException {
  constructor(
    error: ApiError = ApiError.InvalidRequest,
    status = 400,
    meta: ApiResponseMeta = {},
    options?: HttpExceptionOptions,
  ) {
    super(
      {
        success: false,
        statusCode: status,
        error: {
          type: error,
          message: ApiErrorMessage[error],
        },
        meta,
      } as ApiErrorResponse,
      status,
      options,
    );
  }
}
