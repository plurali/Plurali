import { c } from "@/app/utils";
import { PolymorphicProps } from "@/components/types/utils";
import { WithClassName } from "@/components/types/utils";
import Link, { LinkProps } from "next/link";
import { ElementType } from "react";
import { Spinner } from "./Spinner";

export type ButtonProps<C extends ElementType = "button"> = PolymorphicProps<C, WithClassName> & {
    loading?: boolean,
    spinnerClassName?: string,
}

export const Button = <C extends ElementType = "button">({ as, className, children, loading = false, spinnerClassName = "", ...props }: ButtonProps<C>) => {
    const Component = as ?? "button";

    return (
        <Component className={c("hover:opacity-75 px-4 py-2 rounded-xl transition", className)} {...props}>
            {children}
            {loading && <Spinner className={spinnerClassName} />}
        </Component>
    )
}

export const ButtonLink = ({
    href,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
    children,
    ...props
}: Omit<ButtonProps<"a">, "as"> & Omit<LinkProps, "as" | "legacyBehavior" | "passHref">) => {
    return <Link href={href} replace={replace} scroll={scroll} shallow={shallow} passHref={true} prefetch={prefetch} locale={locale} legacyBehavior={true}>
        <Button as={"a"} {...props}>
            {children}
        </Button>
    </Link>
}