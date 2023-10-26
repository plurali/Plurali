import { $api } from "@/app/api/ApiService";
import { useRouter } from "next/router";

export const useLogout = () => {
    const router = useRouter();

    return () => {
        $api.token.clear()
        $api.updateAuth();
        router.push("/");
    }
}