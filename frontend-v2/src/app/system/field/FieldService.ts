import type { ApiService } from '@/app/api/ApiService';
import { $api } from '@/app/api/ApiService';
import { ApiResponse } from '@app/v2/types/response';
import {UpdateFieldRequest} from '@app/v2/dto/field/request/UpdateFieldRequest'
import { FieldDto } from '@app/v2/dto/field/FieldDto';

export class FieldService {
  constructor(public readonly api: ApiService) {}

  public async getFields(): Promise<ApiResponse<FieldDto[]>> {
    try {
      return (
        await this.api.client.request<ApiResponse<FieldDto[]>>({
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
    data: Partial<UpdateFieldRequest>
  ): Promise<ApiResponse<FieldDto>> {
    try {
      return (
        await this.api.client.request<ApiResponse<FieldDto>>({
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
