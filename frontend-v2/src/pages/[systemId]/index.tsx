import { getRouteParam } from '@/app/utils';
import { Conditional } from '@/components/Conditional';
import { SystemSummary } from '@/components/system/SystemSummary';
import { usePublicSystemQuery } from '@/hooks/system/query';
import { useRouter } from 'next/router';

export const SystemPage = () => {
  const router = useRouter();
  const query = usePublicSystemQuery(getRouteParam(router.query.systemId));

  return (
    <Conditional
      query={query}
      render={system => (
        <>
          <SystemSummary system={system} dashboardMode={false} />
        </>
      )}
    />
  );
};

export default SystemPage;
