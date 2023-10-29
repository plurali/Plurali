import { ApiResponse, SystemDtoInterface, UpdateSystemRequestInterface } from '../types';
import { $api, ApiService } from '../ApiService';

export class SystemService {
  constructor(public readonly api: ApiService) {}

  public async getSystem(): Promise<ApiResponse<SystemDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemDtoInterface>>({
          url: '/v2/system',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystem(systemId: string): Promise<ApiResponse<SystemDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemDtoInterface>>({
          url: `/v2/public/system/${systemId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystem(data: Partial<UpdateSystemRequestInterface>): Promise<ApiResponse<SystemDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemDtoInterface>>({
          url: `/v2/system`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystemBackgroundImage(file: Blob): Promise<ApiResponse<SystemDtoInterface>> {
    try {
      return (await this.api.client.postForm<ApiResponse<SystemDtoInterface>>('/v2/system/background', { file })).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

}

export const $system = new SystemService($api);
