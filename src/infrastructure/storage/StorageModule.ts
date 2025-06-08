import { DigitalOceanModule } from "@infra/digitalocean/DigitalOceanModule";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { S3StorageService } from "./s3/S3StorageService";
import { StorageService } from "./StorageService";

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
