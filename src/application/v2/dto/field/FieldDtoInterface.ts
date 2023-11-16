import { IdentifiableEntityDtoInterface } from '@app/v2/types/response';
import { MemberFieldType } from '@domain/plural/utils';
import { FieldDataDtoInterface } from './FieldDataDtoInterface';

export interface FieldDtoInterface extends IdentifiableEntityDtoInterface {
  name: string;
  position: number;
  fieldType: MemberFieldType;
  data: FieldDataDtoInterface;
}
