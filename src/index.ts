import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import { ConfigInterface, ServerConfig } from '@app/Config';
import { ServerKernel } from '@app/Kernel';
import { swagger } from '@app/misc/swagger';
import { csp } from '@app/misc/csp';
// import { ChildProcess, fork } from 'child_process';
import { overrideLoggerPrefix } from './domain/common';
import { CacheService } from '@domain/cache/CacheService';

async function bootstrap() {
  const logger = overrideLoggerPrefix(new ConsoleLogger());

  const app = await NestFactory.create<NestFastifyApplication>(ServerKernel, new FastifyAdapter(), {
    logger,
  });
  const config = app.get<ConfigService<ConfigInterface>>(ConfigService);
  const server = config.get<ServerConfig>('server');

  const isDev = config.get<boolean>('dev');
  // const plural = config.get<PluralConfig>('plural');

  app.enableCors({
    credentials: true,
    origin: server.cors.origin,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
  });

  // Production
  if (!isDev) {
    await app.register(compression, { encodings: ['gzip', 'deflate'] });

    await app.register(helmet, {
      contentSecurityPolicy: csp,
    });
  }

  // Development
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swagger));

  const cacheService = app.get(CacheService);

  await cacheService.rebuild();

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

  await app.listen(server as any);
}
bootstrap();
