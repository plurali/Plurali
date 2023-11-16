import { Body, Container, Head, Hr, Html, Link, Preview, Tailwind, Text } from '@react-email/components';
import { PropsWithChildren } from 'react';
import { linkClassName } from '../constants';

export const BaseEmail = ({ children, previewText }: PropsWithChildren<{ previewText: string }>) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind>
      <Body className="bg-gray-50 my-auto mx-auto font-sans">
        <Container className="bg-white shadow-xl border border-solid border-gray-100 rounded my-20 mx-auto px-10 pt-6 pb-9 w-[600px]">
          {children}
          <Hr className="border border-solid border-gray-100 my-8 rounded-full mx-0 w-full" />

          <Text className="text-gray-600 text-xs tracking-wide">
            {new Date().getFullYear()}{' '}
            <Link href="https://plurali.icu" target="_blank" rel="noreferrer noopener" className={linkClassName}>
              Plurali
            </Link>{' '}
            by{' '}
            <Link
              href="https://github.com/lilianalillyy"
              target="_blank"
              rel="noreferrer noopener"
              className="text-violet-700 font-medium"
            >
              Liliana
            </Link>{' '}
            and contributors.
            <br />
            Plurali is{' '}
            <Link
              href="https://github.com/Plurali/plurali"
              target="_blank"
              rel="noreferrer noopener"
              className={linkClassName}
            >
              open-source
            </Link>{' '}
            and licensed under the{' '}
            <Link
              href="https://github.com/plurali/Plurali/blob/9d69e371e53f4645fc92d8e16c374525cd8ff4ff/LICENSE"
              target="_blank"
              rel="noreferrer nooepner"
              className={linkClassName}
            >
              MIT license
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
