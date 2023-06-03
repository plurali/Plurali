import { c, transitionClass } from "@/app/utils";
import { NavLink } from "./Navbar";
import Link from "next/link";

export const Footer = () => (
  <footer className="py-12 px-4 flex flex-col md:flex-row text-black">
    <div className="w-full flex justify-center md:justify-start items-center text-center md:text-left">
      <Link href="/" className={c("flex flex-col hover:text-gray-600", transitionClass)}>
        <span className="text-2xl font-medium">Plurali</span>
        <span>
        Plurali is in an early beta, things <s>may</s> will break. 
        <br/>
        Feel free to{' '}<a href="https://github.com/plurali/Plurali/issues" target="_blank" rel="noreferrer noopener">
          <u>report them</u>
        </a>.
      </span>
      </Link>
    </div>
    <div className="w-full flex items-center justify-center  text-center md:text-left">
      <span>
        {new Date().getFullYear()} &ndash; <Link href="/">Plurali</Link> by <Link href="/liliana">liliana1110</Link> and contributors.
      </span>
    </div>
    <div className="w-full flex flex-col justify-center items-center md:items-end mt-8 md:mt-0  text-center md:text-left">
      <NavLink href="/contribute">Contribute to Plurali</NavLink>
      <NavLink href="/support">Support Discord</NavLink>
      <NavLink href="/data-transparency">Data Transparency</NavLink>
    </div>
  </footer>
);
