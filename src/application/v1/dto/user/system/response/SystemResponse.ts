import { ApiProperty } from '@nestjs/swagger';
import { SystemDto } from '../SystemDto';

export class SystemResponse {
  @ApiProperty()
  public readonly system: SystemDto;

  @ApiProperty()
  public readonly warning?: string;

  constructor(system: SystemDto, warning?: string) {
    this.system = system;
    this.warning = warning;
  }
}
