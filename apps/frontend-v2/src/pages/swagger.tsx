import { $api } from '@/app/api/ApiService';
import { useBackgroundState } from '@/store/background';
import { useGoBackState } from '@/store/goBack';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: true });

export const Swagger = () => {
  const [, setGoBackState] = useGoBackState();
  const [, setBackground] = useBackgroundState();

  useEffect(() => {
    setGoBackState('/');
    setBackground('#89bf04');

    return () => {
      setGoBackState(null);
      setBackground(null);
    };
  }, []);

  return <SwaggerUI url={`${$api.baseUrl}/oa-json`} deepLinking={true} />;
};

export default Swagger;
