import { c, isUrl } from '@/app/utils';
import { AlertRenderer } from '@/components/layout/AlertRenderer';
import { BackgroundRenderer } from '@/components/layout/BackgroundRenderer';
import { Footer } from '@/components/layout/Footer';
import { GoBackRenderer } from '@/components/layout/GoBackRenderer';
import { useBackgroundState } from '@/store/background';
import { PropsWithChildren } from 'react';

export const DefaultLayout = ({ children }: PropsWithChildren) => {
  const [background] = useBackgroundState();

  return (
    <>
      <BackgroundRenderer />
      <div className="container max-w-7xl mx-auto">
        <div className="py-16 md:py-24 px-4">
          <AlertRenderer />
          <div className={c('bg-white rounded-2xl shadow-2xl p-8', background && isUrl(background) && 'bg-opacity-60')}>
            <GoBackRenderer />

            {children}

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
