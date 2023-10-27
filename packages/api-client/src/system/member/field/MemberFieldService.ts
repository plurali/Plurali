import type { ApiService } from '../../../ApiService';
import { $api } from '../../../ApiService';
import { ApiResponse } from '@plurali/pluraliapp/src/application/v2/types/response';
import { ValueFieldDtoInterface } from '@plurali/pluraliapp/src/application/v2/dto/field/ValueFieldDtoInterface';

export class MemberFieldService {
  constructor(public readonly api: ApiService) {}

  public async getFields(memberId: string): Promise<ApiResponse<ValueFieldDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<ValueFieldDtoInterface[]>>({
          url: `/v2/member/${memberId}/field`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async getPublicFields(systemId: string, memberId: string): Promise<ApiResponse<ValueFieldDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<ValueFieldDtoInterface[]>>({
          url: `/v2/public/system/${systemId}/member/${memberId}/field`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $memberField = new MemberFieldService($api);
