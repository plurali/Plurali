import { observerLogger, ObserverMicroserviceKernel } from "@app/observer/ObserverMicroserviceKernel";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ObserverMicroserviceKernel, {
    transport: Transport.TCP,
    options: {
      host: process.env.PLURAL_OBSERVER_HOST ?? "127.0.0.1",
      port: Number(process.env.PLURAL_OBSERVER_PORT || "4444"),
    },
    logger: observerLogger,
  });

  await app.listen();
}

bootstrap();
