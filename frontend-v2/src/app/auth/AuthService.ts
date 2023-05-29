import type { AuthRequest } from '@app/v2/dto/auth/request/AuthRequest';
import type { AuthDto } from '@app/v2/dto/auth/AuthDto';
import { $api, ApiService } from '@/app/api/ApiService';
import { ApiResponse } from '@app/v2/types/response';

export class AuthService {
  constructor(private readonly api: ApiService) { }

  public async register(data: AuthRequest): Promise<ApiResponse<AuthDto>> {
    try {
      const res = await this.api.client.request<ApiResponse<AuthDto>>({
        url: '/v2/auth/register',
        method: 'PUT',
        data,
      });

      if (res.data.success) {
        this.api.token.set(res.data.data.token);
        this.api.updateAuth();
      }

      return res.data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async login(data: AuthRequest): Promise<ApiResponse<AuthDto>> {
    try {
      const res = await this.api.client.request<ApiResponse<AuthDto>>({
        url: '/v2/auth/login',
        method: 'POST',
        data,
      });

      if (res.data.success) {
        this.api.token.set(res.data.data.token);
        this.api.updateAuth();
      }

      return res.data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  protected updateAuth(token: string | null) {
    this.api.token.set(token);
    this.api.updateAuth();
  }
}

export const $auth = new AuthService($api);
