import { $api, ApiService } from '../ApiService';
import { ApiResponse, AuthDtoInterface, AuthRequestInterface } from '../types';

export class AuthService {
  constructor(private readonly api: ApiService) {}

  public async register(data: AuthRequestInterface): Promise<ApiResponse<AuthDtoInterface>> {
    try {
      const res = await this.api.client.request<ApiResponse<AuthDtoInterface>>({
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

  public async login(data: AuthRequestInterface): Promise<ApiResponse<AuthDtoInterface>> {
    try {
      const res = await this.api.client.request<ApiResponse<AuthDtoInterface>>({
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
