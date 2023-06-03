import { c } from "@/app/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export const HeroTitle = ({ children, className = "", ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) => (
    <h1 className={c("text-2xl md:text-5xl font-bold text-white mb-1.5 opacity-75", className)} {...props}>
        {children}
    </h1>
);