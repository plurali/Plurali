import { MicroserviceKernel } from "@app/Kernel";
import { overrideLoggerPrefix } from "@domain/common";
import { PluralObserverModule } from "@domain/plural/observer/PluralObserverModule";
import { ConsoleLogger, Global, Module } from "@nestjs/common";

/**
 * @internal
 */
export const observerLogger = overrideLoggerPrefix(new ConsoleLogger(), "Microservice_Observer");

@Global()
@Module({
  imports: [MicroserviceKernel, PluralObserverModule],
  providers: [
    {
      provide: ConsoleLogger,
      useValue: observerLogger,
    },
  ],
  exports: [MicroserviceKernel, PluralObserverModule, ConsoleLogger],
})
export class ObserverMicroserviceKernel {}
