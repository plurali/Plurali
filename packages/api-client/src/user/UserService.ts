import { $api, ApiService } from "../ApiService";
import type {
  ApiResponse,
  OkInterface,
  UpdateUserRequestInterface,
  UserDtoInterface,
  VerifyUserEmailRequestInterface,
} from "../types";

export class UserService {
  constructor(private readonly api: ApiService) {}

  public async getUser(): Promise<ApiResponse<UserDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserDtoInterface>>({
          url: "/v2/user",
          method: "GET",
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
          url: "/v2/user",
          method: "PATCH",
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async resendVerificationEmail(): Promise<ApiResponse<OkInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<OkInterface>>({
          url: "/v2/user/resend-email",
          method: "POST",
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async verifyEmail(data: VerifyUserEmailRequestInterface): Promise<ApiResponse<UserDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<UserDtoInterface>>({
          url: "/v2/user/verify-email",
          method: "POST",
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async rebuild(userId?: string): Promise<ApiResponse<OkInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<OkInterface>>({
          url: "/v2/user/rebuild" + (userId ? `/${userId}` : ""),
          method: "POST",
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $user = new UserService($api);
