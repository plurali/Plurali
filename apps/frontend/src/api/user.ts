import { AxiosResponse } from 'axios';
import { $axios } from '.';
import type { Status } from '@app/v1/dto/Status';
import type { UserResponse } from '@app/v1/dto/user/response/UserResponse';
import type { UpdateUserRequest } from '@app/v1/dto/user/request/UpdateUserRequest';
import type { ApiResponse } from '@app/v2/types/response';
import type { Ok } from '@app/v2/dto/response/Ok';
import type { VerifyUserEmailRequestInterface } from '@app/v2/dto/user/request/VerifyUserEmailRequestInterface';

export const getUser = (): Promise<AxiosResponse<Status<UserResponse>>> =>
  $axios.request<Status<UserResponse>>({
    url: '/v1/user',
    method: 'GET',
  });

export const updateUser = (data: UpdateUserRequest): Promise<AxiosResponse<Status<UserResponse>>> =>
  $axios.request<Status<UserResponse>>({
    url: '/v1/user',
    method: 'POST',
    data,
  });

export const verifyUserEmail = (data: VerifyUserEmailRequestInterface): Promise<AxiosResponse<ApiResponse<Ok>>> =>
  $axios.request<ApiResponse<Ok>>({
    url: `/v2/user/verify-email`,
    method: 'POST',
    data
  });
