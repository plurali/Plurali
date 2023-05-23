import { ApiErrorMessage } from '../dto/response/errors';
import { ApiError } from '../dto/response/errors';
import { ApiWarning } from '../dto/response/warning';

export interface ApiResponseMeta {
  warning?: ApiWarning;
}

export interface ApiResponsePagination {
  current: number;
  total: number;
  max: number;
}

export interface ApiResponseBase {
  success: boolean;
  statusCode: number;
  meta: ApiResponseMeta;
}

export interface ApiResponseError {
  success: boolean;
  statusCode: number;
  meta: ApiResponseMeta;
}

export interface ApiDataResponse<D> extends ApiResponseBase {
  success: true;
  data: D;
}

export interface ApiPaginatedDataResponse<I = unknown> extends ApiDataResponse<I[]> {
  pagination: ApiResponsePagination;
}

export interface ApiErrorResponse<E extends ApiError = ApiError> extends ApiResponseBase {
  success: false;
  error: {
    type: E;
    message: (typeof ApiErrorMessage)[E];
  };
}

export type ApiResponse<D = object, E extends ApiError = ApiError> = ApiDataResponse<D> | ApiErrorResponse<E>;

export type ApiPaginatedResponse<I = unknown, E extends ApiError = ApiError> =
  | ApiPaginatedDataResponse<I>
  | ApiErrorResponse<E>;
