import { Module } from '@nestjs/common';
import { CacheService } from './CacheService';
import { SystemModule } from '@domain/system/SystemModule';
import { UserModule } from '@domain/user/UserModule';
import { PluralModule } from '@domain/plural/PluralModule';
import { SearchModule } from '@domain/search/SearchModule';

@Module({
  imports: [SystemModule, UserModule, PluralModule, SearchModule],
  providers: [CacheService],
})
export class CacheModule {}
