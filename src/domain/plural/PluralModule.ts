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
      provide: 'PluralRestServiceBase',
      useClass: PluralRestService,
    },
  ],
  exports: [PluralRestService, 'PluralRestServiceBase'],
})
export class PluralModule {}
