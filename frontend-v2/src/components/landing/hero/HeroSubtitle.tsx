import { c } from "@/app/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export const HeroSubtitle = ({ children, className = "", ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) => (
    <h2 {...props} className={c("text-md md:text-2xl font-medium text-white mb-1.5 opacity-75", className)}>{children}</h2>
);