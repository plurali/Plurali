import { Visibility } from "@prisma/client";

export interface UpdateFieldRequestInterface {
    visibility: Visibility | null;
}