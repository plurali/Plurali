import type { ApiService } from '../../ApiService';
import { $api } from '../../ApiService';
import { ApiResponse } from '@plurali/pluraliapp/src/application/v2/types/response';
import { UpdateFieldRequestInterface } from '@plurali/pluraliapp/src/application/v2/dto/field/request/UpdateFieldRequestInterface';
import { FieldDtoInterface } from '@plurali/pluraliapp/src/application/v2/dto/field/FieldDtoInterface';

export class FieldService {
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

export const $field = new FieldService($api);
