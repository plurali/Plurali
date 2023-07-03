import { useUserQuery } from "@/hooks/user/query";
import { UserDtoInterface } from "@app/v2/dto/user/UserDtoInterface";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Loader } from "./ui/elements/Loader";

export interface AuthenticatedProps {
    redirect?: string;
    children?: ReactElement | ((user: UserDtoInterface) => ReactElement);
}

export const Authenticated = ({ redirect = "/auth/login", children }: AuthenticatedProps) => {
    const router = useRouter();
    const { data, isLoading, isError } = useUserQuery();

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center">
                <Loader className="w-10 h-10" />
            </div>
        );
    }

    if (isError || !data) {
        if (typeof window !== "undefined") {
            router.push(redirect);
        }

        return null;
    }

    return (typeof children === "function" ? children(data) : children) ?? null;
}