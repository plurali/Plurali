import Link from 'next/link';

export const Footer = () => (
  <div className="pt-5 mt-5 inline-flex w-full justify-start items-center font-normal text-gray-700 border-t">
    <p>
      <Link href="/" className="text-violet-700 font-medium">
        Plurali
      </Link>
      {' by '}
      <a
        href="https://github.com/lilianalillyy"
        target="_blank"
        rel="noreferrer noopener"
        className="text-violet-700 font-medium"
      >
        Liliana
      </a>
      <br />
      <span>
        Plurali is in a early beta, things <s>may</s> will break. Feel free to{' '}
        <a href="https://github.com/plurali/Plurali/issues" target="_blank" rel="noreferrer noopener">
          <u>report them</u>
        </a>
        .
      </span>
      <br />
      <span className="text-sm text-gray-500">
        Not affiliated with Apparyllis/Simply Plural{' | '}
        <a
          href="https://github.com/plurali/Plurali/blob/dev/DATA.md"
          target="_blank"
          rel="noreferrer noopener"
          className="text-violet-500"
        >
          Data Transparency
        </a>
      </span>
    </p>
  </div>
);
