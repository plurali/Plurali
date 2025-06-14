import { BaseEntry } from ".";

export type PluralFieldEntry = BaseEntry<FieldContent>;

export interface FieldContent {
  uid: string;
  name: string;
  order: string;
  type: number;
  supportsMarkdown: boolean;
  buckets: string[];
  // Reference to legacy field id
  oid?: string;
}
