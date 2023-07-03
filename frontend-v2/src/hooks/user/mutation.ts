import { $api } from '@/app/api/ApiService';
import { queryClient } from '@/app/api/queryClient';
import { $user } from '@/app/user/UserService';
import { createMutation } from '@/app/utils/data';
import { UserDtoInterface } from '@app/v2/dto/user/UserDtoInterface';
import { UpdateUserRequestInterface } from '@app/v2/dto/user/request/UpdateUserRequestInterface';
import { ApiErrorResponse } from '@app/v2/types/response';
import { UseMutationResult, useMutation } from 'react-query';

export const useUserMutation = (): UseMutationResult<
  UserDtoInterface,
  ApiErrorResponse,
  Partial<UpdateUserRequestInterface>
> => {
  const token = $api.token.get();

  return useMutation({
    mutationFn: createMutation<UserDtoInterface>($user.updateUser),
    onSuccess: user => {
      queryClient.setQueryData(['dashboard:user', token], user);
    },
  });
};
