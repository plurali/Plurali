import { MicroserviceKernel } from '@app/Kernel';
import { PluralObserverModule } from '@domain/plural/observer/PluralObserverModule';
import { ConsoleLogger, Global, Module } from '@nestjs/common';
import { overrideLoggerPrefix } from '@domain/common';

/**
 * @internal
 */
export const observerLogger = overrideLoggerPrefix(new ConsoleLogger(), 'Microservice_Observer');

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
