import type { UpdateUserRequestInterface } from '@plurali/pluraliapp/src/application/v2/dto/user/request/UpdateUserRequestInterface';
import type { UserDtoInterface } from '@plurali/pluraliapp/src/application/v2/dto/user/UserDtoInterface';
import type { ApiService } from '../ApiService';
import { $api } from '../ApiService';
import { ApiResponse } from '@plurali/pluraliapp/src/application/v2/types/response';

export class UserService {
  constructor(private readonly api: ApiService) {}

  public async getUser(): Promise<ApiResponse<UserDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserDtoInterface>>({
          url: '/v2/user',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateUser(data: UpdateUserRequestInterface): Promise<ApiResponse<UserDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserDtoInterface>>({
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
