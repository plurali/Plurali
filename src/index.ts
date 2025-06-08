import { ConfigInterface, ServerConfig } from "@app/Config";
import { ServerKernel } from "@app/Kernel";
import { csp } from "@app/misc/csp";
import { createSentryInterceptor } from "@app/misc/sentry";
import { swagger } from "@app/misc/swagger";
import { CacheService } from "@domain/cache/CacheService";
import compression from "@fastify/compress";
import helmet from "@fastify/helmet";
import fastifyMultipart from "@fastify/multipart";
import { ConsoleLogger, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { SwaggerModule } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

// import { ChildProcess, fork } from 'child_process';
import { overrideLoggerPrefix } from "./domain/common";

async function bootstrap() {
  const logger = overrideLoggerPrefix(new ConsoleLogger());

  const app = await NestFactory.create<NestFastifyApplication>(ServerKernel, new FastifyAdapter(), {
    logger,
  });
  const config = app.get<ConfigService<ConfigInterface>>(ConfigService);
  const server = config.get<ServerConfig>("server");

  const isDev = config.get<boolean>("dev");
  // const plural = config.get<PluralConfig>('plural');

  const sentryDsn = config.get<string>("sentry");

  if (sentryDsn) {
    logger.log("Enabling Sentry logging");

    Sentry.init({
      dsn: sentryDsn,
      debug: isDev,
      environment: config.get("env"),
      tracesSampleRate: 1.5,
      profilesSampleRate: 1.5,
      integrations: [new ProfilingIntegration()],
    });

    ["uncaughtException", "unhandledRejection"].forEach((eventName) => {
      process.addListener(eventName as any, (e) => {
        Sentry.captureException(e);
      });
    });

    app.useGlobalInterceptors(createSentryInterceptor());
  }

  app.enableCors({
    credentials: true,
    origin: server.cors.origin,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "2",
  });

  app.register(fastifyMultipart);

  // Production
  if (!isDev) {
    await app.register(compression, { encodings: ["gzip", "deflate"] });

    await app.register(helmet, {
      contentSecurityPolicy: csp,
    });
  }

  // Development
  SwaggerModule.setup("oa", app, SwaggerModule.createDocument(app, swagger, { deepScanRoutes: true }));

  if (process.argv.includes("--rebuild") || process.argv.includes("--rebuild-only")) {
    const cacheService = app.get(CacheService);

    await cacheService.rebuild();
  }

  // const observerProcess: ChildProcess | null = plural.observer.fork
  //   ? fork(require.resolve('./application/observer/entry'), {
  //       env: process.env,
  //       detached: !isDev,
  //     })
  //   : null;

  // if (observerProcess) {
  //   observerProcess.addListener('close', code => {
  //     throw new Error(`Observer process exited with code ${code}`);
  //   });
  //   process.on('beforeExit', () => observerProcess?.kill());
  // }

  app.enableShutdownHooks();

  if (!process.argv.includes("--rebuild-only")) {
    await app.listen(server as any);
  } else {
    process.exit(0);
  }
}
bootstrap();
