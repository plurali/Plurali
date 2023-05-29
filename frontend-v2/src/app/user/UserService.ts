import type { UpdateUserRequest } from '@app/v2/dto/user/request/UpdateUserRequest';
import type {UserDto} from '@app/v2/dto/user/UserDto';
import type { ApiService } from '@/app/api/ApiService';
import { $api } from '@/app/api/ApiService';
import { ApiResponse } from '@app/v2/types/response';

export class UserService {
  constructor(private readonly api: ApiService) {}

  public async getUser(): Promise<ApiResponse<UserDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserDto>>({
          url: '/v2/user',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateUser(data: UpdateUserRequest): Promise<ApiResponse<UserDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserDto>>({
          url: '/v2/user',
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $user = new UserService($api);
