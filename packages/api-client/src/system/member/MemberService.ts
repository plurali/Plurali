import { $api, ApiService } from '../../ApiService';
import { ApiResponse, MemberDtoInterface, PaginationRequestQuery, UpdateMemberRequestInterface } from '../../types';

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
  
}

export const $member = new MemberService($api);
