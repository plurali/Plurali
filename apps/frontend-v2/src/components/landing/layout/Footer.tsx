import { c, transitionClass } from '@/app/utils';
import { NavLink } from './Navbar';
import Link from 'next/link';
import { githubUrl, issueUrl, supportUrl, transparencyUrl } from '@/app/constants';

export const Footer = () => (
  <footer className="py-12 px-4 flex flex-col md:flex-row text-black">
    <div className="hidden md:flex w-full flex-col items-start text-center md:text-left">
      <Link href="/" className={c('flex flex-col hover:text-gray-600', transitionClass)}>
        <span className="text-2xl font-medium">Plurali</span>
      </Link>

      <span>
        Plurali is in an early beta, things <s>may</s> will break.
        <br />
        Feel free to{' '}
        <a href={issueUrl} target="_blank" rel="noreferrer noopener">
          <u>report them</u>
        </a>
        .
      </span>
    </div>
    <div className="w-full flex items-center justify-center  text-center md:text-left">
      <span>
        {new Date().getFullYear()} &ndash; <Link href="/">Plurali</Link> by <Link href="/liliana">liliana1110</Link> and
        contributors.
      </span>
    </div>
    <div className="w-full flex flex-col justify-center items-center md:items-end mt-8 md:mt-0  text-center md:text-left">
      <NavLink href={githubUrl} newTab>
        Contribute to Plurali
      </NavLink>
      <NavLink href={supportUrl} newTab>
        Support
      </NavLink>
      <NavLink href={transparencyUrl} newTab>
        Data Transparency
      </NavLink>
      <NavLink to="/swagger">API Docs</NavLink>
    </div>
  </footer>
);
