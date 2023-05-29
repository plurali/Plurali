import type { UpdateMemberRequest } from '@app/v2/dto/member/request/UpdateMemberRequest';
import type { UpdatePageRequest } from '@app/v2/dto/page/request/UpdatePageRequest';
import type { CreatePageRequest } from '@app/v2/dto/page/request/CreatePageRequest';
import type { Ok } from '@app/v2/dto/response/Ok';
import type { MemberDto } from '@app/v2/dto/member/MemberDto';
import type { PageDto } from '@app/v2/dto/page/PageDto';
import { $api, ApiService } from '@/app/api/ApiService';
import type { PaginationRequestQuery } from '@app/v2/types/request';
import type { ApiResponse } from '@app/v2/types/response';

export class MemberService {
  constructor(private readonly api: ApiService) {
  }

  public async getMembers(): Promise<ApiResponse<MemberDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDto[]>>({
          url: '/v2/member',
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMember(id: string): Promise<ApiResponse<MemberDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDto>>({
          url: `/v2/member/${id}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMember(systemId: string, memberId: string): Promise<ApiResponse<MemberDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDto>>({
          url: `/v2/public/system/${systemId}/member/${memberId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMembers(systemId: string, query?: PaginationRequestQuery): Promise<ApiResponse<MemberDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDto[]>>({
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
    data: Partial<UpdateMemberRequest>
  ): Promise<ApiResponse<MemberDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<MemberDto>>({
          url: `/v2/member/${id}`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateMemberBackgroundImage(id: string, file: Blob): Promise<ApiResponse<MemberDto>> {
    try {
      return (
        await this.api.client.postForm<ApiResponse<MemberDto>>(`/v2/member/${id}/background`, {
          file,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMemberPages(systemId: string, memberId: string): Promise<ApiResponse<PageDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto[]>>({
          url: `/v2/public/system/${systemId}/member/${memberId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicMemberPage(systemId: string, memberId: string, pageId: string): Promise<ApiResponse<PageDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto>>({
          url: `/v2/public/system/${systemId}/member/${memberId}/page/${pageId}`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMemberPages(memberId: string): Promise<ApiResponse<PageDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto[]>>({
          url: `/v2/member/${memberId}/page`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getMemberPage(memberId: string, pageId: string): Promise<ApiResponse<PageDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'GET',
        })).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateMemberPage(
    memberId: string,
    pageId: string,
    data: Partial<UpdatePageRequest>
  ): Promise<ApiResponse<PageDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async deleteMemberPage(memberId: string, pageId: string): Promise<ApiResponse<Ok>> {
    try {
      return (
        await this.api.client.request<ApiResponse<Ok>>({
          url: `/v2/member/${memberId}/page/${pageId}`,
          method: 'DELETE',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async createMemberPage(memberId: string, data: CreatePageRequest): Promise<ApiResponse<PageDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<PageDto>>({
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
