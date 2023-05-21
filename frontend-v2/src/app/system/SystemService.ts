import type { UpdateSystemRequest } from '@app/v1/dto/user/system/request/UpdateSystemRequest';
import type { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse';
import type { ApiService } from '@/app/api/ApiService';
import type { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';
import type { PageResponse } from '@app/v2/dto/page/response/PageResponse';
import type { UpdatePageRequest } from '@app/v2/dto/page/request/UpdatePageRequest';
import type { OkResponse } from '@app/v1/dto/OkResponse';
import type { CreatePageRequest } from '@app/v2/dto/page/request/CreatePageRequest';
import type { ApiResponse } from '../api/types';
import { $api } from '@/app/api/ApiService';

export class SystemService {
  constructor(public readonly api: ApiService) {}

  public async getSystem(): Promise<ApiResponse<SystemResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemResponse>>({
          url: '/v1/system',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystem(systemId: string): Promise<ApiResponse<SystemResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemResponse>>({
          url: `/v1/public/system/${systemId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystem(data: Partial<UpdateSystemRequest>): Promise<ApiResponse<SystemResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemResponse>>({
          url: `/v1/system`,
          method: 'POST',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystemBackgroundImage(file: Blob): Promise<ApiResponse<SystemResponse>> {
    try {
      return (await this.api.client.postForm<ApiResponse<SystemResponse>>('/v1/system/background', { file })).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystemPages(systemId: string): Promise<ApiResponse<PagesResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PagesResponse>>({
          url: `/v2/public/system/${systemId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystemPage(systemId: string, pageId: string): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
          url: `/v2/public/system/${systemId}/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getSystemPages(): Promise<ApiResponse<PagesResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PagesResponse>>({
          url: `/v2/system/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getSystemPage(pageId: string): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
          url: `/v2/system/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystemPage(pageId: string, data: Partial<UpdatePageRequest>): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
          url: `/v2/system/page/${pageId}`,
          method: 'POST',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async deleteSystemPage(pageId: string): Promise<ApiResponse<OkResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<OkResponse>>({
          url: `/v2/system/page/${pageId}`,
          method: 'DELETE',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async createSystemPage(data: CreatePageRequest): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
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
