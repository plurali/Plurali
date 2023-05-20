import { SystemDto } from '../SystemDto';

export class SystemResponse {
  constructor(public readonly system: SystemDto, public readonly warning?: string) {}
}
