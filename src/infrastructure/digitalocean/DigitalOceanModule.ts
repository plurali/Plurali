import { Module } from '@nestjs/common';
import { DigitalOceanService } from './DigitalOceanService';

@Module({
  providers: [DigitalOceanService],
  exports: [DigitalOceanService],
})
export class DigitalOceanModule {}
