import { SystemModule } from "@domain/system/SystemModule";
import { UserModule } from "@domain/user/UserModule";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import { PluralObserverUpdateQueue } from "../utils";
import { PluralObserverBag } from "./PluralObserverBag";

@Module({
  imports: [
    UserModule,
    SystemModule,
    BullModule.registerQueue({
      name: PluralObserverUpdateQueue,
    }),
  ],
  providers: [PluralObserverBag],
  exports: [BullModule],
})
export class PluralObserverModule {}
