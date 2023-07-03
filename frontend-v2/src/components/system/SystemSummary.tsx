import { Title } from '../ui/typography/Title';
import { Subtitle } from '../ui/typography/Subtitle';
import { Sanitized } from '../Sanitized';
import { string } from '@/app/system/field/utils';
import { SystemDtoInterface } from '@app/v2/dto/system/SystemDtoInterface';
import { ColorCircle } from '../ui/elements/ColorCircle';
import { Tag } from '../ui/elements/Tag';
import { Visibility } from '@prisma/client';
import { useSystemMutation } from '@/hooks/system/mutation';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Link from 'next/link';
import { Editor } from '../ui/form/Editor';
import { ButtonLink } from '../ui/elements/Button';
import { UserContent } from '../ui/elements/UserContent';

export interface SystemSummaryProps {
  system: SystemDtoInterface;
  dashboardMode?: boolean;
}

export const SystemSummary = ({ system, dashboardMode = false }: SystemSummaryProps) => {
  const mutation = useSystemMutation();

  const [disabled, setDisabled] = useState(false);

  const toggleVisibility = async () => {
    setDisabled(true);

    try {
      await mutation.mutateAsync({
        visibility: system.data.visibility === Visibility.Public ? Visibility.Private : Visibility.Public,
      });
    } catch (e) {
      console.error('Failed to toggle visibility for system', { system, e });
    }

    setDisabled(false);
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="mb-5 flex flex-col text-center sm:flex-row sm:text-left justify-left items-center gap-4">
          {system.avatar ? (
            <img src={system.avatar} alt={system.name} className="flex-shrink-0 w-32 h-32 rounded-full object-cover" />
          ) : (
            <ColorCircle color={system.color} className="flex-shrink-0 !w-32 !h-32 opacity-25" />
          )}

          <div>
            {dashboardMode && <p className="text-sm text-gray-700">ID: {system.id}</p>}

            <Title className="inline-flex flex-col sm:flex-row items-center justify-center gap-3">
              {system.name}

              {dashboardMode && (
                <>
                  <Tag
                    toggled={system.data.visibility === Visibility.Public}
                    disabled={disabled}
                    onToggle={toggleVisibility}
                  >
                    {system.data.visibility}
                  </Tag>

                  {system.data.visibility === Visibility.Public && (
                    <Link
                      href={`/${system.data.slug}`}
                      className="text-sm text-gray-700 font-normal"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <u>Open public view</u>
                    </Link>
                  )}
                </>
              )}
            </Title>

            {system.description && (
              <Subtitle className="mb-3">
                <Sanitized unsafeValue={string(system.description, true)} />
              </Subtitle>
            )}

            {system.color && (
              <span className="inline-flex text-gray-700 items-center gap-1">
                Color: {system.color} <ColorCircle color={system.color} />
              </span>
            )}
          </div>
        </div>

        {dashboardMode && (
          <div className="flex items-center gap-2">
            <ButtonLink
              href={'/dashboard/system/page/add'}
              className="border-[2.5px] bg-white bg-opacity-25 border-violet-300 text-black inline-flex justify-center items-center gap-1"
            >
              <DocumentIcon className="w-8 h-8 -ml-1" />
              <span>New Page</span>
            </ButtonLink>
          </div>
        )}
      </div>

      {dashboardMode ? (
        <Editor
          initialValue={system.data.description ?? ''}
          placeholder={`Add custom description for ${system.name}...`}
        />
      ) : system.data.description && (
        <UserContent>
          <Sanitized unsafeValue={system.data.description}/>
        </UserContent>
      )}
    </>
  );
};
