import { PageDtoInterface } from '@app/v2/dto/page/PageDtoInterface';
import { SystemDtoInterface } from '@app/v2/dto/system/SystemDtoInterface';
import { ApiErrorResponse } from '@app/v2/types/response';
import { $api, $system } from '@plurali/api-client';
import { UseQueryResult, useQuery } from 'react-query';

export const usePublicSystemQuery = (systemId: string): UseQueryResult<SystemDtoInterface> => {
  return useQuery({
    queryKey: ['public:system', systemId],
    queryFn: async () => {
      if (!systemId) return null;

      const data = await $system.getPublicSystem(systemId);

      if (!data.success) {
        return Promise.reject(data);
      }

      return data.data;
    },
  });
};

export const useSystemQuery = (): UseQueryResult<SystemDtoInterface> => {
  const token = $api.token.get();

  return useQuery({
    queryKey: ['dashboard:system', token],
    queryFn: async () => {
      if (!token) return null;

      const data = await $system.getSystem();

      if (!data.success) {
        return Promise.reject(data);
      }

      return data.data;
    },
  });
};

export const usePublicSystemPageQuery = (
  systemId: string,
  pageId: string,
): UseQueryResult<PageDtoInterface, ApiErrorResponse> => {
  return useQuery({
    queryKey: ['public:system', systemId, 'page', pageId],
    queryFn: async () => {
      const data = await $system.getPublicSystemPage(systemId, pageId);

      if (!data.success) {
        return Promise.reject(data);
      }

      return data.data;
    },
  });
};
