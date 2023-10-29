import { IdentifiableEntityDtoInterface } from "@app/v2/types/response";
import { MemberDataDtoInterface } from "./MemberDataDtoInterface";

export interface MemberDtoInterface extends IdentifiableEntityDtoInterface {
    systemId: string;

    systemRef: string;

    pluralId: string;

    name: string;

    pronouns: string | null;

    color: string | null;

    description: string | null;

    data: MemberDataDtoInterface;

    avatar: string | null;
}