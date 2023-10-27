import type { ApiService } from '../../ApiService';
import { $api } from '../../ApiService';
import { ApiResponse } from '@plurali/pluraliapp/src/application/v2/types/response';
import { PageDtoInterface } from '@plurali/pluraliapp/src/application/v2/dto/page/PageDtoInterface';
import { UpdatePageRequestInterface } from '@plurali/pluraliapp/src/application/v2/dto/page/request/UpdatePageRequestInterface';
import { OkInterface } from '@plurali/pluraliapp/src/application/v2/dto/response/OkInterface';
import { CreatePageRequestInterface } from '@plurali/pluraliapp/src/application/v2/dto/page/request/CreatePageRequestInterface';

export class SystemPageService {
    constructor(private readonly api: ApiService) { }

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

    public async getSystemPage(pageId: string): Promise<ApiResponse<PageDtoInterface>> {
        try {
            return (
                await this.api.client.request<ApiResponse<PageDtoInterface>>({
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

export const $systemPage = new SystemPageService($api);