import { c } from "@/app/utils";
import { PropsWithChildren } from "react";

export const Alert = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => (
    <div className={c("px-8 py-2.5 mb-4 font-medium rounded-2xl w-full", className)}>
        {children}
    </div>
)