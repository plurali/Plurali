import type { UpdateUserRequest } from '@app/v1/dto/user/request/UpdateUserRequest';
import type { UserResponse } from '@app/v1/dto/user/response/UserResponse';
import type { ApiResponse } from '@/app/api/types';
import type { ApiService } from '@/app/api/ApiService';
import { $api } from '@/app/api/ApiService';

export class UserService {
  constructor(private readonly api: ApiService) {}

  public async getUser(): Promise<ApiResponse<UserResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserResponse>>({
          url: '/v1/user',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateUser(data: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserResponse>>({
          url: '/v1/user',
          method: 'POST',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $user = new UserService($api);
