import type { UpdateMemberRequestInterface } from '@app/v2/dto/member/request/UpdateMemberRequestInterface';
import type { UpdatePageRequestInterface } from '@app/v2/dto/page/request/UpdatePageRequestInterface';
import type { CreatePageRequestInterface } from '@app/v2/dto/page/request/CreatePageRequestInterface';
import type { OkInterface } from '@app/v2/dto/response/OkInterface';
import type { MemberDtoInterface } from '@app/v2/dto/member/MemberDtoInterface';
import type { PageDtoInterface } from '@app/v2/dto/page/PageDtoInterface';
import { $api, ApiService } from '@/app/api/ApiService';
import type { PaginationRequestQuery } from '@app/v2/types/request';
import type { ApiResponse } from '@app/v2/types/response';

export class MemberService {
  constructor(private readonly api: ApiService) {}

  public async getMembers(): Promise<ApiResponse<MemberDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDtoInterface[]>>({
          url: '/v2/member',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMember(id: string): Promise<ApiResponse<MemberDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDtoInterface>>({
          url: `/v2/member/${id}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMember(systemId: string, memberId: string): Promise<ApiResponse<MemberDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDtoInterface>>({
          url: `/v2/public/system/${systemId}/member/${memberId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMembers(
    systemId: string,
    query?: PaginationRequestQuery
  ): Promise<ApiResponse<MemberDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDtoInterface[]>>({
          url: `/v2/public/system/${systemId}/member`,
          method: 'GET',
          params: query,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateMember(
    id: string,
    data: Partial<UpdateMemberRequestInterface>
  ): Promise<ApiResponse<MemberDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDtoInterface>>({
          url: `/v2/member/${id}`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateMemberBackgroundImage(id: string, file: Blob): Promise<ApiResponse<MemberDtoInterface>> {
    try {
      return (
        await this.api.client.postForm<ApiResponse<MemberDtoInterface>>(`/v2/member/${id}/background`, {
          file,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMemberPages(systemId: string, memberId: string): Promise<ApiResponse<PageDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface[]>>({
          url: `/v2/public/system/${systemId}/member/${memberId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMemberPage(
    systemId: string,
    memberId: string,
    pageId: string
  ): Promise<ApiResponse<PageDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface>>({
          url: `/v2/public/system/${systemId}/member/${memberId}/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMemberPages(memberId: string): Promise<ApiResponse<PageDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface[]>>({
          url: `/v2/member/${memberId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMemberPage(memberId: string, pageId: string): Promise<ApiResponse<PageDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateMemberPage(
    memberId: string,
    pageId: string,
    data: Partial<UpdatePageRequestInterface>
  ): Promise<ApiResponse<PageDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async deleteMemberPage(memberId: string, pageId: string): Promise<ApiResponse<OkInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<OkInterface>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'DELETE',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async createMemberPage(
    memberId: string,
    data: CreatePageRequestInterface
  ): Promise<ApiResponse<PageDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDtoInterface>>({
          url: `/v2/member/${memberId}/page`,
          method: 'PUT',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $member = new MemberService($api);
