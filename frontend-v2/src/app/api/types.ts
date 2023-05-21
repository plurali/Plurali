import type { SuccessData } from '@app/v1/dto/Status';

export interface ApiDataResponse<D = SuccessData> {
  success: true;
  data: D;
}

export interface ApiErrorResponse<E extends string = string> {
  success: false;
  error: E;
}

export type ApiResponse<D = SuccessData, E extends string = string> = ApiDataResponse<D> | ApiErrorResponse<E>;
