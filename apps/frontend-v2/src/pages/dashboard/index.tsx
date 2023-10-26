import { Authenticated } from '@/components/Authenticated';
import { Button, ButtonLink } from '@/components/ui/elements/Button';
import { Subtitle } from '@/components/ui/typography/Subtitle';
import { Title } from '@/components/ui/typography/Title';
import { useLogout } from '@/hooks/user';

export const DashboardPage = () => {
  const logout = useLogout();

  return (
    <Authenticated>
      <>
        <div className="mb-5">
          <Title>Plurali</Title>
          <Subtitle>Informative page about your system and it's members you can share with people!</Subtitle>
        </div>

        <div className="inline-flex items-center gap-2">
          <ButtonLink href="/dashboard/user" className="bg-violet-700 text-white">
            User settings
          </ButtonLink>

          <ButtonLink href="/dashboard/system" className="bg-violet-700 text-white">
            System
          </ButtonLink>

          <Button onClick={logout} className="border border-violet-700 text-violet-700">
            Logout
          </Button>
        </div>
      </>
    </Authenticated>
  );
};

export default DashboardPage;
