import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from '../PageDto';

export class PageResponse {
  @ApiProperty()
  public readonly page: PageDto;

  constructor(page: PageDto) {
    this.page = page;
  }
}
