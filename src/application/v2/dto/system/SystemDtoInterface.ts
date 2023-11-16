import { IdentifiableEntityDtoInterface } from '@app/v2/types/response';
import { SystemDataDtoInterface } from './SystemDataDtoInterface';

export interface SystemDtoInterface extends IdentifiableEntityDtoInterface {
  name: string;
  color: string | null;
  description: string | null;
  avatar: string | null;
  data: SystemDataDtoInterface;
}
