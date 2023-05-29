import { $api } from "@/app/api/ApiService";
import dynamic from "next/dynamic";

import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: true });

export const Swagger = () => (
    <SwaggerUI url={`${$api.baseUrl}/oa-json`} deepLinking={true} />
)

export default Swagger;