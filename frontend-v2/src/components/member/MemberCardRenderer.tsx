import { MemberDtoInterface } from '@app/v2/dto/member/MemberDtoInterface';
import { Visibility } from '@prisma/client';

export interface MemberCardRendererProps {
  members: MemberDtoInterface[];
  title?: string;
  onToggleVisibility?: (member: MemberDtoInterface, visibility: Visibility) => Promise<unknown>;
}

export const MemberCardRenderer = ({ members, title }: MemberCardRendererProps) => {
  return (
    <div className="mb-5">
      {title && (
        <p className="inline-flex items-center gap-1 mb-3">
          {title} ({members.length}):
        </p>
      )}
    </div>
  );
};
