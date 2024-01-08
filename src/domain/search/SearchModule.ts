import { Module } from '@nestjs/common';
import { MeiliModule } from '@infra/meili/MeiliModule';
import { SearchService } from './SearchService';

@Module({
  imports: [MeiliModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
