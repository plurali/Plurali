import { useRouter } from "next/router"

export const useIsDashboard = () => {
    const router = useRouter();
    return router.pathname.startsWith("/dashboard");
}

export const useIsLanding = () => {
    const router = useRouter();
    return router.pathname === "/";
}