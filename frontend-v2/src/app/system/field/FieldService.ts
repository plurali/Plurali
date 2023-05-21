import type { UpdateSystemFieldRequest } from '@app/v1/dto/user/system/request/UpdateSystemFieldRequest';
import type { SystemFieldResponse } from '@app/v1/dto/user/system/response/SystemFieldResponse';
import type { ApiService } from '@/app/api/ApiService';
import { $api } from '@/app/api/ApiService';
import { ApiResponse } from '@/app/api/types';

export class FieldService {
  constructor(public readonly api: ApiService) {}

  public async updateField(
    id: string,
    data: Partial<UpdateSystemFieldRequest>
  ): Promise<ApiResponse<SystemFieldResponse>> {
    try {
      return (
        await this.api.client.request<ApiResponse<SystemFieldResponse>>({
          url: `/v1/system/fields/${id}`,
          method: 'POST',
          data,
        })
      ).data;
    } catch (error) {
      return this.api.handleException(error);
    }
  }
}

export const $field = new FieldService($api);
