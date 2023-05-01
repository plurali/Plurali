import { ConsoleLogger, Global, Inject, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { plainToInstance } from 'class-transformer';
import { Config } from './Config';
import { validateSync } from 'class-validator';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'ioredis';
import { redisStore } from 'cache-manager-ioredis-yet';
import { PrismaModule as BasePrismaModule } from 'nestjs-prisma';
import { SystemModule } from '@domain/system/SystemModule';
import { UserModule } from '@domain/user/UserModule';
import { overrideLoggerPrefix } from '@domain/common';
import { CacheRepository } from '@infra/cache/CacheRepository';
import { CacheService } from '@domain/cache/CacheService';
import { ApiV1Module } from './v1/ApiV1Module';
import { ApiV2Module } from './v2/ApiV2Module';
import { PluralModule } from '@domain/plural/PluralModule';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config: Record<string, unknown>) => {
        const validatedConfig = plainToInstance(Config, config, { enableImplicitConversion: true });
        const errors = validateSync(validatedConfig, { skipMissingProperties: false });

        if (errors.length > 0) {
          throw new Error(errors.toString());
        }

        return validatedConfig;
      },
      validationOptions: {
        abortEarly: true,
      },
      isGlobal: true,
    }),

    CacheModule.registerAsync<RedisOptions>({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<Config>) => ({
        store: redisStore,
        ...config.get('redis'),
      }),
      inject: [ConfigService],
    }),

    BasePrismaModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Config>) => ({
        explicitConnect: true,
        prismaOptions: {
          log: config.get<boolean>('dev') ? ['query', 'warn', 'error'] : [],
          datasources: {
            db: {
              url: config.get<string>('db')
            }
          }
        },
      }),
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<Config>) => {
        const redis = config.get<RedisOptions>('redis');
        return {
          redis,
        };
      },
      inject: [ConfigService],
    }),

    SystemModule,
    UserModule,
    PluralModule,
  ],
  providers: [CacheRepository, CacheService],
  exports: [BullModule, CacheRepository, CacheService],
})
export class Kernel {}

/**
 * @internal
 */
export const serverLogger = overrideLoggerPrefix(new ConsoleLogger());

@Global()
@Module({
  imports: [Kernel, ApiV1Module, ApiV2Module],
  providers: [
    {
      provide: Logger,
      useValue: serverLogger,
    },
    {
      provide: ConsoleLogger,
      useValue: serverLogger,
    },
  ],
  exports: [Kernel, ConsoleLogger, Logger],
})
export class ServerKernel {}

@Global()
@Module({
  imports: [Kernel],
  // microservices add their own logger
  exports: [Kernel],
})
export class MicroserviceKernel {}
