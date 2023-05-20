import { AxiosResponse } from 'axios';
import { $axios } from '.';
import type { Status } from '@app/v1/dto/Status';
import type { LoginResponse } from '@app/v1/dto/auth/response/LoginResponse';
import type { AuthRequestBody } from '@app/v1/dto/auth/request/AuthRequestBody';
import type { OkResponse } from '@app/v1/dto/OkResponse';

export const register = (data: AuthRequestBody): Promise<AxiosResponse<Status<LoginResponse>>> =>
  $axios.request<Status<LoginResponse>>({
    url: '/auth/register',
    method: 'PUT',
    data,
  });

export const login = (data: AuthRequestBody): Promise<AxiosResponse<Status<LoginResponse>>> =>
  $axios.request<Status<LoginResponse>>({
    url: '/auth/login',
    method: 'POST',
    data,
  });

export const logout = (): Promise<AxiosResponse<Status<OkResponse>>> =>
  $axios.request<Status<OkResponse>>({
    url: '/auth/logout',
    method: 'POST',
  });
