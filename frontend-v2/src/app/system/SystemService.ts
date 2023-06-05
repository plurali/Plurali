import type { ApiService } from '@/app/api/ApiService';
import { $api } from '@/app/api/ApiService';
import { ApiResponse } from '@app/v2/types/response';
import { SystemDtoInterface } from '@app/v2/dto/system/SystemDtoInterface';
import { UpdateSystemRequestInterface } from '@app/v2/dto/system/request/UpdateSystemRequestInterface';
import { PageDtoInterface } from '@app/v2/dto/page/PageDtoInterface';
import { UpdatePageRequestInterface } from '@app/v2/dto/page/request/UpdatePageRequestInterface';
import { OkInterface } from '@app/v2/dto/response/OkInterface';
import { CreatePageRequestInterface } from '@app/v2/dto/page/request/CreatePageRequestInterface';

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

  public async getPublicSystemPages(systemId: string): Promise<ApiResponse<PageDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface[]>>({
          url: `/v2/public/system/${systemId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystemPage(systemId: string, pageId: string): Promise<ApiResponse<PageDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface>>({
          url: `/v2/public/system/${systemId}/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getSystemPages(): Promise<ApiResponse<PageDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface[]>>({
          url: `/v2/system/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getSystemPage(pageId: string): Promise<ApiResponse<PageDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface[]>>({
          url: `/v2/system/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystemPage(
    pageId: string,
    data: Partial<UpdatePageRequestInterface>
  ): Promise<ApiResponse<PageDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface>>({
          url: `/v2/system/page/${pageId}`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async deleteSystemPage(pageId: string): Promise<ApiResponse<OkInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<OkInterface>>({
          url: `/v2/system/page/${pageId}`,
          method: 'DELETE',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async createSystemPage(data: CreatePageRequestInterface): Promise<ApiResponse<PageDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface>>({
          url: `/v2/system/page`,
          method: 'PUT',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $system = new SystemService($api);
