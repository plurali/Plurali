import { PropsWithChildren, ComponentProps, useMemo, useState, HTMLAttributes } from "react";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import Link, { LinkProps } from "next/link";
import { ButtonLink } from "@/components/ui/elements/Button";
import { c, transitionClass, external } from "@/app/utils";

export type NavLinkProps = Omit<LinkProps, "href"> & { to?: LinkProps["href"]; href?: ComponentProps<"a">["href"]; newTab?: boolean } & HTMLAttributes<HTMLAnchorElement>;

export const NavLink = ({ children, className: _className = "", to, href = "#", newTab = false, ...props }: PropsWithChildren<NavLinkProps>) => {
  const className = useMemo(() => c("text-black hover:text-gray-600 font-medium", transitionClass, _className), [_className]);

  return to ? (
    <Link href={to} className={className} {...props} {...(newTab ? external : {})}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className} {...props} {...(newTab ? external : {})}>
      {children}
    </a>
  );
};

export const Navbar = () => {
  const navLinks: PropsWithChildren<NavLinkProps>[] = [
    { href: "https://ko-fi.com/liliana1110", children: "Donate", newTab: true },
    // { to: "/support", children: "Support", newTab: true },
    { href: "https://github.com/plurali/plurali", children: "Contribute", newTab: true },
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((val) => !val);

  return (
    <div className="relative">
      <div className="py-6 px-4 flex items-center justify-center z-50">
        <div className="w-full flex justify-start items-center">
          <Link href="/" className={c("text-black hover:text-gray-600", transitionClass)}>
            <h1 className="font-medium text-2xl">Plurali</h1>
            <h2 className="hidden md:inline-block">Creative pages for your system</h2>
          </Link>
        </div>
        <div className="w-full justify-center items-center hidden md:flex">
          {navLinks.map(({ className = "", children, ...link }, i) => (
            <NavLink {...link} className={`${className} ${i !== navLinks.length - 1 && "mr-8"}`} key={i}>
              {children}
            </NavLink>
          ))}
        </div>
        <div className="w-full flex justify-end items-center">
          <Link href="/dashboard" passHref legacyBehavior>
            <ButtonLink href="/dashboard" className="hidden md:inline-flex text-white bg-violet-700 px  -6">
                Dashboard
            </ButtonLink>
          </Link>
          <button className="focus:outline-none p-2 rounded-xl bg-primary text-white inline-flex md:hidden" onClick={toggleDrawer}>
            <Bars3BottomRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};