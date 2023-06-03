import { AlertStateProvider } from '@/store/alert';
import { BackgroundStateProvider } from '@/store/background';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { GoBackStateProvider } from '@/store/goBack';
import { DefaultLayout } from '@/layouts/default';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/app/api/queryClient';
import Head from 'next/head';
import { useIsLanding } from '@/hooks/router';
import { LandingLayout } from '@/layouts/landing';

export default function App({ Component, pageProps }: AppProps) {
  const isLanding = useIsLanding();

  const Layout = isLanding ? LandingLayout : DefaultLayout;
   
  return (
    <>
      <Head>
        <title>Plurali</title>
      </Head>
      <BackgroundStateProvider>
        <AlertStateProvider>
          <GoBackStateProvider>
            <div
              id="plurali"
              className={isLanding ? 'landing' : 'relative w-screen min-h-screen bg-cover bg-no-repeat bg-center flex font-sans'}
            >
              <QueryClientProvider client={queryClient}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </QueryClientProvider>
            </div>
          </GoBackStateProvider>
        </AlertStateProvider>
      </BackgroundStateProvider>
    </>
  );
}
