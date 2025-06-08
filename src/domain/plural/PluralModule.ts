import { Module } from "@nestjs/common";

import { PluralCachedRestService } from "./PluralCachedRestService";
import { PluralRestService } from "./PluralRestService";

@Module({
  providers: [
    {
      provide: PluralRestService,
      useClass: PluralCachedRestService,
    },
    {
      provide: "PluralRestServiceBase",
      useClass: PluralRestService,
    },
  ],
  exports: [PluralRestService, "PluralRestServiceBase"],
})
export class PluralModule {}
