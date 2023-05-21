import { AxiosResponse } from 'axios';
import { $axios } from '.';
import type { Status } from '@app/v1/dto/Status';
import type { AuthResponse } from '@app/v1/dto/auth/response/AuthResponse';
import type { AuthRequest } from '@app/v1/dto/auth/request/AuthRequest';
import type { OkResponse } from '@app/v1/dto/OkResponse';

export const register = (data: AuthRequest): Promise<AxiosResponse<Status<AuthResponse>>> =>
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
