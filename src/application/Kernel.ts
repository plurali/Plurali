import { ConsoleLogger, Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import KeyvValkey from '@keyv/valkey';
import { plainToInstance } from 'class-transformer';
import { Config, ConfigInterface } from './Config';
import { validateSync } from 'class-validator';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule as BasePrismaModule } from 'nestjs-prisma';
import { SystemModule } from '@domain/system/SystemModule';
import { UserModule } from '@domain/user/UserModule';
import { overrideLoggerPrefix } from '@domain/common';
import { CacheRepository } from '@infra/cache/CacheRepository';
import { CacheService } from '@domain/cache/CacheService';
import { ApiV1Module } from './v1/ApiV1Module';
import { ApiV2Module } from './v2/ApiV2Module';
import { PluralModule } from '@domain/plural/PluralModule';
import { SecurityModule } from '@domain/security/SecurityModule';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './misc/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisOptions } from 'iovalkey';

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

    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<ConfigInterface>) => ({
        stores: [new KeyvValkey(config.get('redis'))],
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigInterface>) => ({
        transport: config.get('email').transport,
        defaults: {
          from: `"Plurali" <${config.get('email').from}>`,
        },
      }),
    }),

    BasePrismaModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigInterface>) => ({
        explicitConnect: true,
        prismaOptions: {
          log: config.get<boolean>('dev') ? ['warn', 'error'] : [],
          datasources: {
            db: {
              url: config.get<string>('db'),
            },
          },
        },
      }),
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<ConfigInterface>) => {
        return {
          connection: config.get<RedisOptions>('redis'),
        };
      },
      inject: [ConfigService],
    }),

    JwtModule.register(jwtConfig),

    SystemModule,
    UserModule,
    PluralModule,
    SecurityModule,
  ],
  providers: [CacheRepository, CacheService],
  exports: [BullModule, CacheRepository, CacheService],
})
export class Kernel { }

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
export class ServerKernel { }

@Global()
@Module({
  imports: [Kernel],
  // microservices add their own logger
  exports: [Kernel],
})
export class MicroserviceKernel { }
