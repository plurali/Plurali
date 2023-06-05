import { FieldDtoInterface } from '@app/v2/dto/field/FieldDtoInterface';
import { InfoField } from './InfoField';
import { Visibility } from '@prisma/client';

export interface InfoFieldRendererProps {
  fields: FieldDtoInterface[];
  title?: string;
  onToggleVisibility?: (field: FieldDtoInterface, visibility: Visibility) => Promise<unknown>;
}

export const InfoFieldRenderer = ({ fields, title = 'Custom Fields', onToggleVisibility }: InfoFieldRendererProps) => {
  return fields.length ? (
    <div className="mb-5">
      <p className="inline-flex items-center gap-1 mb-3">
        {title} ({fields.length}):
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {fields.map(field => (
          <InfoField
            key={field.id}
            field={field}
            onToggleVisibility={onToggleVisibility ? v => onToggleVisibility(field, v) : undefined}
          ></InfoField>
        ))}
      </div>
    </div>
  ) : null;
};
