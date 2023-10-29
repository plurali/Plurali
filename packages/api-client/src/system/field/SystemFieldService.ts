import type { ApiService } from '../../ApiService';
import { $api } from '../../ApiService';
import { ApiResponse, FieldDtoInterface, UpdateFieldRequestInterface } from '../../types';

export class SystemFieldService {
  constructor(public readonly api: ApiService) {}

  public async getFields(): Promise<ApiResponse<FieldDtoInterface[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<FieldDtoInterface[]>>({
          url: `/v2/system/field`,
          method: 'GET',
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }

  public async updateField(
    id: string,
    data: Partial<UpdateFieldRequestInterface>
  ): Promise<ApiResponse<FieldDtoInterface>> {
    try {
      return (
        await this.api.client.request<ApiResponse<FieldDtoInterface>>({
          url: `/v2/system/field/${id}`,
          method: 'PATCH',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $systemField = new SystemFieldService($api);
