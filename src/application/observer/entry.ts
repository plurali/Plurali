import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ObserverMicroserviceKernel, observerLogger } from '@app/observer/ObserverMicroserviceKernel';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ObserverMicroserviceKernel, {
    transport: Transport.TCP as any,
    options: {
      host: process.env.PLURAL_OBSERVER_HOST ?? '127.0.0.1',
      port: process.env.PLURAL_OBSERVER_PORT ?? 4444,
    },
    logger: observerLogger,
  });

  await app.listen();
}

bootstrap();
