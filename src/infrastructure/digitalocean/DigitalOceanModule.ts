import { Module } from '@nestjs/common';
import { DigitalOceanService } from './DigitalOceanService';

@Module({
  providers: [DigitalOceanService],
})
export class DigitalOceanModule {}
