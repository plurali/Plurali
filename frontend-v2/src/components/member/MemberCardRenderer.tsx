import { MemberDto } from "@app/v2/dto/member/MemberDto";
import { Visibility } from "@prisma/client";

export interface MemberCardRendererProps {
    members: MemberDto[]
    title?: string
    onToggleVisibility?: (member: MemberDto, visibility: Visibility) => Promise<unknown>;
}

export const MemberCardRenderer = ({ members, title, onToggleVisibility }: MemberCardRendererProps) => {
    return (
        <div className="mb-5">
            {title && (
                <p className="inline-flex items-center gap-1 mb-3">
                    {title} ({members.length}):
                </p>
            )}

                
        </div>
    )
}