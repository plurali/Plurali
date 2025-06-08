import { PluralModule } from "@domain/plural/PluralModule";
import { SystemModule } from "@domain/system/SystemModule";
import { UserModule } from "@domain/user/UserModule";
import { Module } from "@nestjs/common";

import { CacheService } from "./CacheService";

@Module({
  imports: [SystemModule, UserModule, PluralModule],
  providers: [CacheService],
})
export class CacheModule {}
