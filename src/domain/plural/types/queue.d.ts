import { MemberOperation } from "./socket";

export interface UpdateMemberQueueData {
    systemId: string;
    systemPluralId: string;
    userId: string;
    operation: MemberOperation
}