import { Module } from '@nestjs/common';
import { PluralObserverBag } from './PluralObserverBag';
import { BullModule } from '@nestjs/bull';
import { PluralObserverUpdateQueue } from '../utils';
import { SystemModule } from '@domain/system/SystemModule';
import { UserModule } from '@domain/user/UserModule';

@Module({
  imports: [
    UserModule,
    SystemModule,
    BullModule.registerQueue({
      name: PluralObserverUpdateQueue,
    }),
  ],
  providers: [PluralObserverBag],
  exports: [BullModule]
})
export class PluralObserverModule {}
