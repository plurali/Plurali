import { AlertStateProvider } from '@/store/alert';
import { BackgroundStateProvider } from '@/store/background';
import { Inter } from 'next/font/google';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { GoBackStateProvider } from '@/store/goBack';
import { c } from '@/app/utils';
import { DefaultLayout } from '@/layouts/default';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BackgroundStateProvider>
      <AlertStateProvider>
        <GoBackStateProvider>
          <div
            id="plurali"
            className={c('relative w-screen min-h-screen bg-cover bg-no-repeat bg-center flex', inter.className)}
          >
            <DefaultLayout>
              <Component {...pageProps} />
            </DefaultLayout>
          </div>
        </GoBackStateProvider>
      </AlertStateProvider>
    </BackgroundStateProvider>
  );
}
