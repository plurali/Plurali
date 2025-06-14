import type { ResetPasswordRequestInterface } from "@app/v2/dto/auth/request/ResetPasswordRequestInterface";
import { OkInterface } from "@app/v2/dto/response/OkInterface";
import { ApiResponse } from "@app/v2/types/response";
import { AxiosResponse } from "axios";

import { $axios } from ".";

export const requestPasswordReset = (email: string): Promise<AxiosResponse<ApiResponse<OkInterface>>> =>
  $axios.request<ApiResponse<OkInterface>>({
    url: `/v2/auth/reset-password`,
    method: "GET",
    params: {
      email,
    },
  });

export const processPasswordReset = (
  data: ResetPasswordRequestInterface,
): Promise<AxiosResponse<ApiResponse<OkInterface>>> =>
  $axios.request<ApiResponse<OkInterface>>({
    url: `/v2/auth/reset-password`,
    method: "PUT",
    data,
  });
