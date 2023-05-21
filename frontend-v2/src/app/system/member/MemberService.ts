import type { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';
import type { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse';
import type { UpdateSystemMemberRequest } from '@app/v1/dto/user/system/request/UpdateSystemMemberRequest';
import type { PagesResponse } from '@app/v2/dto/page/response/PagesResponse';
import type { PageResponse } from '@app/v2/dto/page/response/PageResponse';
import type { UpdatePageRequest } from '@app/v2/dto/page/request/UpdatePageRequest';
import type { OkResponse } from '@app/v1/dto/OkResponse';
import type { CreatePageRequest } from '@app/v2/dto/page/request/CreatePageRequest';
import type { ApiService } from '@/app/api/ApiService';
import type { ApiResponse } from '@/app/api/types';
import { $api } from '@/app/api/ApiService';

export class MemberService {
  constructor(private readonly api: ApiService) {}

  public async getMembers(): Promise<ApiResponse<SystemMembersResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemMembersResponse>>({
          url: '/v1/system/members',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMember(id: string): Promise<ApiResponse<SystemMemberResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemMemberResponse>>({
          url: `/v1/system/members/${id}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMember(systemId: string, memberId: string): Promise<ApiResponse<SystemMemberResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemMemberResponse>>({
          url: `/v1/public/system/${systemId}/members/${memberId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMembers(systemId: string): Promise<ApiResponse<SystemMembersResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemMembersResponse>>({
          url: `/v1/public/system/${systemId}/members`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateMember(
    id: string,
    data: Partial<UpdateSystemMemberRequest>
  ): Promise<ApiResponse<SystemMemberResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemMemberResponse>>({
          url: `/v1/system/members/${id}`,
          method: 'POST',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateMemberBackgroundImage(id: string, file: Blob): Promise<ApiResponse<SystemMemberResponse>> {
    try {
      return (
        await this.api.client.postForm<ApiResponse<SystemMemberResponse>>(`/v1/system/members/${id}/background`, {
          file,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMemberPages(memberId: string): Promise<ApiResponse<PagesResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PagesResponse>>({
          url: `/v2/public/member/${memberId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMemberPage(memberId: string, pageId: string): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
          url: `/v2/public/member/${memberId}/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMemberPages(memberId: string): Promise<ApiResponse<PagesResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PagesResponse>>({
          url: `/v2/member/${memberId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMemberPage(memberId: string, pageId: string): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
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
    data: Partial<UpdatePageRequest>
  ): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'POST',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async deleteMemberPage(memberId: string, pageId: string): Promise<ApiResponse<OkResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<OkResponse>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'DELETE',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async createMemberPage(memberId: string, data: CreatePageRequest): Promise<ApiResponse<PageResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageResponse>>({
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
