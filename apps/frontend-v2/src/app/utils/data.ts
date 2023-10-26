import { ApiResponse } from "@app/v2/types/response";

export const createMutation = <R, D = any>(fn: (data: D) => Promise<ApiResponse<R>>): (data: D) => Promise<R> => {
    return async (data: D) => {
        const res = await fn(data);

        if (!res.success) {
            return Promise.reject(res);
        }

        return res.data;
    }
}