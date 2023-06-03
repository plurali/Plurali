import { c, transitionClass } from "@/app/utils";
import { ComponentProps, PropsWithChildren } from "react";

export interface LinkProps {
  withBorder?: boolean;
}

export const LandingLink = ({ withBorder = false, className, children, ...props }: PropsWithChildren<ComponentProps<"a"> & LinkProps>) => (
  <a className={c("font-bold hover:opacity-75", withBorder && "border-b-2 border-black", className, transitionClass)} {...props}>
    {children}
  </a>
);