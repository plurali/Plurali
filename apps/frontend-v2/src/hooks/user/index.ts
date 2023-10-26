import { $api } from '@plurali/api-client';
import { useRouter } from 'next/router';

export const useLogout = () => {
  const router = useRouter();

  return () => {
    $api.token.clear();
    $api.updateAuth();
    router.push('/');
  };
};
