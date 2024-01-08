import { Module } from '@nestjs/common';
import { MeiliService } from './MeiliService';

@Module({
  providers: [MeiliService],
  exports: [MeiliService],
})
export class MeiliModule {}
