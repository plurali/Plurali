import { $api } from "../ApiService";
import type { ApiService } from "../ApiService";
import type { ApiResponse } from '@plurali/pluraliapp/src/application/v2/types/response';
import type { NotificationDtoInterface } from "@plurali/pluraliapp/src/application/v2/dto/notification/NotificationDtoInterface";

export class NotificationService {
    constructor(private readonly api: ApiService) { }

    public async getNotifications(): Promise<ApiResponse<NotificationDtoInterface[]>> {
        try {
            return (
                await this.api.client.request<ApiResponse<NotificationDtoInterface[]>>({
                    url: '/v2/notification',
                    method: 'GET',
                })
            ).data;
        } catch (error) {
            return this.api.handleException(error);
        }
    }
}


export const $notification = new NotificationService($api);