import { NotificationDtoInterface } from "@app/v2/dto/notification/NotificationDtoInterface";
import { ApiResponse } from "@app/v2/types/response";
import { AxiosResponse } from "axios";

import { $axios } from ".";

export const getNotifications = (): Promise<AxiosResponse<ApiResponse<NotificationDtoInterface[]>>> =>
  $axios.request<ApiResponse<NotificationDtoInterface[]>>({
    url: `/v2/notification`,
    method: "GET",
  });
