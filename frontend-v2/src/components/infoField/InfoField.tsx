import { c } from "@/app/utils";
import { FieldDataDto } from "@app/v2/dto/field/FieldDataDto"
import { FieldDto } from "@app/v2/dto/field/FieldDto"
import { ValueFieldDto } from "@app/v2/dto/field/ValueFieldDto";
import { MemberFieldType } from "@domain/plural/utils";
import { Visibility } from "@prisma/client";
import { useState } from "react";
import { ColorCircle } from "../ui/elements/ColorCircle";
import { Sanitized } from "../Sanitized";
import { formatField } from "@/app/system/field/utils";

export interface InfoFieldProps {
  field: FieldDto | ValueFieldDto;
  onToggleVisibility?: (visibility: Visibility) => Promise<unknown>;
}

export const InfoField = ({ field, onToggleVisibility }: InfoFieldProps) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);

    try {
      await onToggleVisibility?.(field.data.visibility === Visibility.Private ? Visibility.Public : Visibility.Private)
    } catch { }

    setLoading(false);
  }

  return (
    <div
      onClick={onToggleVisibility ? handleToggle : undefined}
      className={c(
        "px-4 py-3 border border-l-4 rounded-2xl block transition cursor-pointer bg-white bg-opacity-25",
        onToggleVisibility && (field.data.visibility === Visibility.Public
          ? 'border-l-green-500'
          : 'border-l-red-500'),
        loading && '!bg-gray-100 bg-opacity-10'
      )}
    >
      <p className="font-medium">{field.name}</p>
      {'value' in field && field.value.length && (
        <p className="text-gray-500">
          {field.fieldType === MemberFieldType.Color ? (
            <span
              className="inline-flex justify-center items-center gap-2"
            >
              <ColorCircle color={field.value} />
              <span className="text-sm">{field.value}</span>
            </span>
          ) : (
            <span className="max-h-20 overflow-x-hidden overflow-y-scroll" v-else>
              <Sanitized unsafeValue={formatField(field) ?? ''} />
            </span>
          )}
        </p>
      )}
    </div >
  );
}