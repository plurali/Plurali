import type { AuthRequest } from '@app/v1/dto/auth/request/AuthRequest';
import type { AuthResponse } from '@app/v1/dto/auth/response/AuthResponse';
import type { ApiResponse } from '@/app/api/types';
import { $api, ApiService } from '@/app/api/ApiService';

export class AuthService {
  constructor(private readonly api: ApiService) {}

  public async register(data: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const res = await this.api.client.request<ApiResponse<AuthResponse>>({
        url: '/v1/auth/register',
        method: 'PUT',
        data,
      });

      if (res.data.success) {
        this.api.token.set(res.data.data.auth);
        this.api.updateAuth();
      }

      return res.data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async login(data: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const res = await this.api.client.request<ApiResponse<AuthResponse>>({
        url: '/v1/auth/register',
        method: 'PUT',
        data,
      });

      if (res.data.success) {
        this.api.token.set(res.data.data.auth);
        this.api.updateAuth();
      }

      return res.data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $auth = new AuthService($api);
