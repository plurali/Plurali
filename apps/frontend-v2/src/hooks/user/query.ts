import { UserDtoInterface } from '@app/v2/dto/user/UserDtoInterface';
import { $api, $user } from '@plurali/api-client';
import { UseQueryResult, useQuery } from 'react-query';

export const useUserQuery = (): UseQueryResult<UserDtoInterface> => {
  const token = $api.token.get();

  return useQuery({
    queryKey: ['dashboard:user', token],
    queryFn: async () => {
      if (!token) return null;

      const data = await $user.getUser();

      if (!data.success) {
        return Promise.reject(data);
      }

      return data.data;
    },
  });
};
