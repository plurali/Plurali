import { AxiosResponse } from 'axios';
import { $axios } from '.';
import type { Status } from '@app/v1/dto/Status';
import type { AuthResponse } from '@app/v1/dto/auth/response/AuthResponse';
import type { AuthRequest } from '@app/v1/dto/auth/request/AuthRequest';
import type { RegisterRequest } from '@app/v1/dto/auth/request/RegisterRequest';
import type { OkResponse } from '@app/v1/dto/OkResponse';
import type { ResetPasswordRequestInterface } from "@app/v2/dto/auth/request/ResetPasswordRequestInterface";
import { ApiResponse } from '@app/v2/types/response';
import { OkInterface } from '@app/v2/dto/response/OkInterface';

export const register = (data: RegisterRequest): Promise<AxiosResponse<Status<AuthResponse>>> =>
  $axios.request<Status<AuthResponse>>({
    url: '/v1/auth/register',
    method: 'PUT',
    data,
  });

export const login = (data: AuthRequest): Promise<AxiosResponse<Status<AuthResponse>>> =>
  $axios.request<Status<AuthResponse>>({
    url: '/v1/auth/login',
    method: 'POST',
    data,
  });

export const logout = (): Promise<AxiosResponse<Status<OkResponse>>> =>
  $axios.request<Status<OkResponse>>({
    url: '/v1/auth/logout',
    method: 'POST',
  });

export const requestPasswordReset = (email: string): Promise<AxiosResponse<ApiResponse<OkInterface>>> =>
  $axios.request<ApiResponse<OkInterface>>({
    url: `/v2/auth/reset-password`,
    method: 'GET',
    params: {
      email,
    }
  });

export const processPasswordReset = (data: ResetPasswordRequestInterface): Promise<AxiosResponse<ApiResponse<OkInterface>>> =>
  $axios.request<ApiResponse<OkInterface>>({
    url: `/v2/auth/reset-password`,
    method: 'PUT',
    data,
  });
