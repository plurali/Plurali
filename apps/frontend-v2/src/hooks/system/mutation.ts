import { $api, $system } from '@plurali/api-client';
import { queryClient } from '@/app/api/queryClient';
import { SystemDtoInterface } from '@app/v2/dto/system/SystemDtoInterface';
import { UpdateSystemRequestInterface } from '@app/v2/dto/system/request/UpdateSystemRequestInterface';
import { ApiErrorResponse } from '@app/v2/types/response';
import { UseMutationResult, useMutation } from 'react-query';

export const useSystemMutation = (): UseMutationResult<
  SystemDtoInterface,
  ApiErrorResponse,
  Partial<UpdateSystemRequestInterface>
> => {
  const token = $api.token.get();

  return useMutation({
    mutationFn: async data => {
      const res = await $system.updateSystem(data);

      if (!res.success) {
        return Promise.reject(res);
      }

      return res.data;
    },
    onSuccess: system => {
      queryClient.setQueryData(['dashboard:system', token], system);
      queryClient.setQueryData(['public:system', system.data.slug], system);
    },
  });
};
