import { MemberDto } from "@app/v2/dto/member/MemberDto";
import { Title } from "../ui/typography/Title";
import { Subtitle } from "../ui/typography/Subtitle";
import { Sanitized } from "../Sanitized";
import { string } from "@/app/system/field/utils";

export interface MemberSummaryProps {
    member: MemberDto;
    dashboardMode?: boolean
}

export const MemberSummary = ({ member, dashboardMode = false }: MemberSummaryProps) => {
    return (
        <div className="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
            {member.avatar && <img
                src={member.avatar}
                alt={member.name}
                className="flex-shrink-0 w-32 h-32 rounded-full object-cover"
            />}
            {/* <ColorCircle v-else :color="member.color ?? '#e2e8f0'" class="flex-shrink-0 w-32 h-32 opacity-25" /> */}
            <div>
                {dashboardMode && <p className="text-sm text-gray-700">ID: {member.id}</p>}

                <Title className="inline-flex flex-col sm:flex-row items-center justify-center gap-3">
                    {member.name}
                </Title>

                {member.description && (
                    <Subtitle className="mb-3">
                        <Sanitized unsafeValue={string(member.description, true)} />
                    </Subtitle>
                )}

                {member.color && (
                    <span className="inline-flex text-gray-700 items-center gap-1">
                        {/* Color: {member.color} <ColorCircle :color="member.color" /> */}
                    </span>
                )}
            </div>
        </div>
    );
}