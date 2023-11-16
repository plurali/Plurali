import { ApiExtraModels } from '@nestjs/swagger';
import { Ok } from '../dto/response/Ok';
import { ApiError, ApiErrorMessage } from '../dto/response/errors';
import {
  ApiDataResponse,
  ApiErrorResponse,
  ApiPaginatedDataResponse,
  ApiResponseMeta,
  ApiResponsePagination,
} from '../types/response';

export interface PaginationQuery {
  skip: number;
  take: number;
}

@ApiExtraModels(Ok)
export abstract class BaseController {
  protected data<D>(data: D, statusCode = 200, meta: ApiResponseMeta = {}): ApiDataResponse<D> {
    return {
      success: true,
      statusCode,
      data,
      meta,
    };
  }

  protected ok(message?: string, statusCode = 200, meta: ApiResponseMeta = {}): ApiDataResponse<Ok> {
    return {
      success: true,
      statusCode,
      data: new Ok(message),
      meta,
    };
  }

  protected paginated<I>(
    data: I[],
    statusCode = 200,
    query: PaginationQuery,
    count: number,
    meta: ApiResponseMeta = {},
  ): ApiPaginatedDataResponse<I> {
    return {
      success: true,
      statusCode,
      data,
      pagination: this.createPagination(query, count),
      meta,
    };
  }

  protected createPaginationQuery(page = 1, take = 20): PaginationQuery {
    if (page < 1) page = 1;

    // Ensure rounded numbers
    page = Math.floor(page);

    return {
      take,
      skip: (page - 1) * take,
    };
  }

  protected createPagination(query: PaginationQuery, count: number): ApiResponsePagination {
    return {
      current: query.skip / query.take + 1,
      total: Math.ceil(count / query.take),
      max: query.take,
    };
  }

  protected error<E extends ApiError>(error: E, statusCode = 400, meta: ApiResponseMeta = {}): ApiErrorResponse<E> {
    return {
      success: false,
      statusCode,
      error: {
        type: error,
        message: ApiErrorMessage[error],
      },
      meta,
    };
  }
}
