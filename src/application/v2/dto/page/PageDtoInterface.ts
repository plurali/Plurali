import { IdentifiableEntityDtoInterface } from "@app/v2/types/response";
import { OwnerType } from "@domain/common";

export interface PageDtoInterface extends IdentifiableEntityDtoInterface {
    ownerType: OwnerType;
    ownerId: string;
    name: string;
    content: string;
    visible: boolean;
}