import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from '../PageDto';

export class PagesResponse {
  @ApiProperty({ type: [PageDto] })
  public pages: PageDto[];

  constructor(pages: PageDto[]) {
    this.pages = pages;
  }
}
