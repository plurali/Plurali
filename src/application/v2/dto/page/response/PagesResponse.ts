import { PageDto } from '../PageDto';

export class PagesResponse {
  constructor(public readonly pages: PageDto[]) {}
}
