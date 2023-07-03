import { Conditional } from '@/components/Conditional';
import { SystemSummary } from '@/components/system/SystemSummary';
import { useSystemQuery } from '@/hooks/system/query';
import { useGoBack } from '@/store/goBack';

export const SystemPage = () => {
  const query = useSystemQuery();

  useGoBack("/dashboard")

  return (
    <Conditional
      query={query}
      render={system => (
        <>
          <SystemSummary system={system} dashboardMode />
        </>
      )}
    />
  );
};

export default SystemPage;
