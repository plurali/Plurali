import { $api } from "@/app/api/ApiService";
import { queryClient } from "@/app/api/queryClient";
import { $system } from "@/app/system/SystemService";
import { SystemDto } from "@app/v2/dto/system/SystemDto";
import { UpdateSystemRequest } from "@app/v2/dto/system/request/UpdateSystemRequest";
import { ApiErrorResponse } from "@app/v2/types/response";
import { UseMutationResult, useMutation } from "react-query";

export const useSystemMutation = (): UseMutationResult<SystemDto, ApiErrorResponse, Partial<UpdateSystemRequest>> => {
    const token = $api.token.get();

    return useMutation({
        mutationFn: async (data) => {
            const res = await $system.updateSystem(data);

            if (!res.success) {
                return Promise.reject(res);
            }

            return res.data;
        },
        onSuccess: (system) => {
            queryClient.setQueryData(['dashboard:system', token], system);
            queryClient.setQueryData(['public:system', system.data.slug], system);
        }
    });
}