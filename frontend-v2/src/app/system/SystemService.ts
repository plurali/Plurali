import type { ApiService } from '@/app/api/ApiService';
import { $api } from '@/app/api/ApiService';
import { ApiResponse } from '@app/v2/types/response';
import {SystemDto} from '@app/v2/dto/system/SystemDto'
import {UpdateSystemRequest} from '@app/v2/dto/system/request/UpdateSystemRequest';
import { PageDto } from '@app/v2/dto/page/PageDto';
import { UpdatePageRequest } from '@app/v2/dto/page/request/UpdatePageRequest';
import { Ok } from '@app/v2/dto/response/Ok';
import { CreatePageRequest } from '@app/v2/dto/page/request/CreatePageRequest';

export class SystemService {
  constructor(public readonly api: ApiService) {}

  public async getSystem(): Promise<ApiResponse<SystemDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemDto>>({
          url: '/v2/system',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystem(systemId: string): Promise<ApiResponse<SystemDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemDto>>({
          url: `/v2/public/system/${systemId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystem(data: Partial<UpdateSystemRequest>): Promise<ApiResponse<SystemDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemDto>>({
          url: `/v2/system`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystemBackgroundImage(file: Blob): Promise<ApiResponse<SystemDto>> {
    try {
      return (await this.api.client.postForm<ApiResponse<SystemDto>>('/v2/system/background', { file })).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystemPages(systemId: string): Promise<ApiResponse<PageDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto[]>>({
          url: `/v2/public/system/${systemId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicSystemPage(systemId: string, pageId: string): Promise<ApiResponse<PageDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto>>({
          url: `/v2/public/system/${systemId}/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getSystemPages(): Promise<ApiResponse<PageDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto[]>>({
          url: `/v2/system/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getSystemPage(pageId: string): Promise<ApiResponse<PageDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto[]>>({
          url: `/v2/system/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateSystemPage(pageId: string, data: Partial<UpdatePageRequest>): Promise<ApiResponse<PageDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto>>({
          url: `/v2/system/page/${pageId}`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async deleteSystemPage(pageId: string): Promise<ApiResponse<Ok>> {
    try {
      return (
        await this.api.client.request<ApiResponse<Ok>>({
          url: `/v2/system/page/${pageId}`,
          method: 'DELETE',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async createSystemPage(data: CreatePageRequest): Promise<ApiResponse<PageDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto>>({
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
