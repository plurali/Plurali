import { Module } from '@nestjs/common';
import { PluralRestService } from './PluralRestService';
import { PluralCachedRestService } from './PluralCachedRestService';

@Module({
  providers: [
    {
      provide: PluralRestService,
      useClass: PluralCachedRestService,
    },
    {
      provide: 'PluralResetServiceBase',
      useClass: PluralRestService,
    },
  ],
  exports: [PluralRestService, 'PluralResetServiceBase'],
})
export class PluralModule {}
