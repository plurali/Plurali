import { AxiosResponse } from 'axios';
import { $axios } from '.';
import type { Status } from '@app/v1/dto/Status';
import type { UserResponse } from '@app/v1/dto/user/response/UserResponse';
import type { UpdateUserRequest } from '@app/v1/dto/user/request/UpdateUserRequest';

export const getUser = (): Promise<AxiosResponse<Status<UserResponse>>> =>
  $axios.request<Status<UserResponse>>({
    url: '/user',
    method: 'GET',
  });

export const updateUser = (data: UpdateUserRequest): Promise<AxiosResponse<Status<UserResponse>>> =>
  $axios.request<Status<UserResponse>>({
    url: '/user',
    method: 'POST',
    data,
  });
