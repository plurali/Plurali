import Link from "next/link"
import { MouseEventHandler, useState } from "react"
import { c } from "@/app/utils"
import { ColorCircle } from "../ui/elements/ColorCircle"
import { Sanitized } from "../Sanitized"
import { string } from "@/app/system/field/utils"
import { MemberDto } from "@app/v2/dto/member/MemberDto"
import { Visibility } from "@prisma/client"

export interface MemberCardProps {
    member: MemberDto,
    onToggleVisibility?: (visibility: Visibility) => Promise<unknown>;
}

export const MemberCard = ({ member, onToggleVisibility }: MemberCardProps) => {
    const [loading, setLoading] = useState(false);

    const handleToggle: MouseEventHandler<HTMLAnchorElement> = async (e) => {
        if (loading || !(e.ctrlKey || e.metaKey)) return;

        setLoading(true);

        try {
            await onToggleVisibility?.(member.data.visibility === Visibility.Private ? Visibility.Public : Visibility.Private);
        } catch { }

        setLoading(false)
    }

    return (
        <Link
            aria-disabled={loading}
            onClick={onToggleVisibility ? handleToggle : undefined}
            href={onToggleVisibility ? `/dashboard/member/${member.id}` : `/${member.systemRef}/m/${member.data.slug}`}
            className={c(
                "px-4 py-2 border border-l-4 rounded-2xl text-sm flex items-center gap-4 transition",
                onToggleVisibility ? (member.data.visibility === Visibility.Public ? 'border-l-green-500' : 'border-l-red-500') : '',
                loading && 'bg-gray-200',
            )}
            style={!onToggleVisibility && member.color ? { borderLeftColor: member.color } : {}}
        >
            {member.avatar ? (
                <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                    loading="lazy"
                />
            ) : (
                <ColorCircle color={member.color} className="flex-shrink-0 w-16 h-16 opacity-25" />
            )}
            <div>
                <h2 className="text-xl font-medium">
                    {member.name}
                    {member.pronouns && (
                        <span className="text-sm text-gray-500 font-normaly">{member.pronouns}</span>
                    )}
                </h2>
                {member.description && (
                    <h3 className="text-gray-700 !max-w-md max-h-20 overflow-hidden w-full">
                        <Sanitized unsafeValue={string(member.description, true)} />
                    </h3>
                )}
            </div>
        </Link>
    )
}