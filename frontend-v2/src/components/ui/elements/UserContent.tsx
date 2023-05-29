import { PropsWithChildren } from "react";
import "./UserContent.module.scss";
import { c } from "@/app/utils";

export const UserContent = ({ children, className }: PropsWithChildren<{ className?: string }>) =>
    <div className={c("user-content", className)}>{children}</div>