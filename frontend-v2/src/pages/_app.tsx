import { AlertStateProvider } from '@/store/alert';
import { BackgroundStateProvider } from '@/store/background';
import { Inter } from 'next/font/google';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { GoBackStateProvider } from '@/store/goBack';
import { c } from '@/app/utils';
import { DefaultLayout } from '@/layouts/default';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/app/api/queryClient';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
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
              className={c('relative w-screen min-h-screen bg-cover bg-no-repeat bg-center flex', inter.className)}
            >
              <QueryClientProvider client={queryClient}>
                <DefaultLayout>
                  <Component {...pageProps} />
                </DefaultLayout>
              </QueryClientProvider>
            </div>
          </GoBackStateProvider>
        </AlertStateProvider>
      </BackgroundStateProvider>
    </>
  );
}
