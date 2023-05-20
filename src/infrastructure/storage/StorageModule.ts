import { Module } from '@nestjs/common';
import { S3StorageService } from './s3/S3StorageService';
import { StorageService } from './StorageService';
import { ConfigModule } from '@nestjs/config';
import { DigitalOceanModule } from '@infra/digitalocean/DigitalOceanModule';

@Module({
  imports: [ConfigModule, DigitalOceanModule],
  providers: [
    {
      provide: StorageService,
      useClass: S3StorageService,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
