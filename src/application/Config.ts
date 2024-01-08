import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RedisOptions } from 'ioredis';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface ServerConfig {
  host: string;
  port: number;
  cors: {
    origin: string;
  };
}

export interface StorageConfig {
  endpoint: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
}

export interface DigitalOceanConfig {
  apiToken: string;
  endpointId: string;
}

export interface PluralObserverConfig {
  host: string;
  port: number;
  fork: boolean;
}

export interface PluralConfig {
  socketEndpoint: string;
  apiEndpoint: string;
  observer: PluralObserverConfig;
}

export interface EmailConfig {
  from: string;
  transport: string;
}

export interface MeiliConfig {
  host: string;
  port: number;
  masterKey: string;
  fullHost: string;
}

export interface ConfigInterface {
  env: Environment;
  dev: boolean;
  server: ServerConfig;
  db: string;
  redis: RedisOptions;
  storage: StorageConfig;
  digitalocean: DigitalOceanConfig | null;
  plural: PluralConfig;
  email: EmailConfig;
  meili: MeiliConfig;
  sentry: string;
}

export class Config implements ConfigInterface {
  @IsEnum(Environment)
  protected NODE_ENV: Environment;

  @IsString()
  protected HOST: string;

  @IsNumber()
  protected PORT: number;

  @IsString()
  protected DATABASE_URL: string;

  @IsString()
  protected CORS_ORIGIN: string;

  @IsString()
  protected REDIS_HOST: string;

  @IsNumber()
  protected REDIS_PORT: number;

  @IsString()
  @IsOptional()
  protected REDIS_PASS?: string;

  @IsString()
  protected S3_ENDPOINT: string;

  @IsString()
  protected S3_ACCESS_KEY_ID: string;

  @IsString()
  protected S3_ACCESS_KEY_SECRET: string;

  @IsString()
  protected S3_BUCKET: string;

  @IsString()
  protected S3_REGION: string;

  @IsString()
  @IsOptional()
  protected DO_API_TOKEN?: string;

  @IsString()
  @IsOptional()
  protected DO_ENDPOINT_ID?: string;

  @IsString()
  @IsOptional()
  protected PLURAL_API = 'https://v2.apparyllis.com/v1';

  @IsString()
  @IsOptional()
  protected PLURAL_WS = 'wss://v2.apparyllis.com/v1/socket';

  @IsBoolean()
  protected PLURAL_OBSERVER_FORK: boolean;

  @IsString()
  protected PLURAL_OBSERVER_HOST: string;

  @IsNumber()
  protected PLURAL_OBSERVER_PORT: number;

  @IsString()
  protected JWT_SECRET: string;

  @IsString()
  protected EMAIL_FROM: string = 'plurali@plurali.icu';

  @IsString()
  protected EMAIL_TRANSPORT: string;

  @IsString()
  protected MEILI_HOST: string = "meilisearch";

  @IsNumber()
  protected MEILI_PORT: number = 7700;
  
  @IsString()
  protected MEILI_MASTER_KEY: string;

  @IsString()
  @IsOptional()
  protected SENTRY_DSN: string | null = null;

  get env(): Environment {
    return this.NODE_ENV;
  }

  get dev(): boolean {
    return this.NODE_ENV === Environment.Development;
  }

  get server(): ServerConfig {
    return {
      host: this.HOST,
      port: this.PORT,
      cors: {
        origin: this.CORS_ORIGIN,
      },
    };
  }

  get email(): EmailConfig {
    return {
      from: this.EMAIL_FROM,
      transport: this.EMAIL_TRANSPORT,
    };
  }

  get db(): string {
    return this.DATABASE_URL;
  }

  get redis(): RedisOptions {
    return {
      host: this.REDIS_HOST,
      port: this.REDIS_PORT,
      password: this.REDIS_PASS,
    };
  }

  get storage(): StorageConfig {
    return {
      endpoint: this.S3_ENDPOINT,
      accessKeyId: this.S3_ACCESS_KEY_ID,
      accessKeySecret: this.S3_ACCESS_KEY_SECRET,
      bucket: this.S3_BUCKET,
      region: this.S3_REGION,
    };
  }

  get digitalocean(): DigitalOceanConfig | null {
    if (!this.DO_API_TOKEN || !this.DO_ENDPOINT_ID) {
      return null;
    }

    return {
      apiToken: this.DO_API_TOKEN,
      endpointId: this.DO_ENDPOINT_ID,
    };
  }

  get plural(): PluralConfig {
    return {
      apiEndpoint: this.PLURAL_API,
      socketEndpoint: this.PLURAL_WS,
      observer: {
        fork: this.PLURAL_OBSERVER_FORK,
        host: this.PLURAL_OBSERVER_HOST,
        port: this.PLURAL_OBSERVER_PORT,
      },
    };
  }

  get meili(): MeiliConfig {
    return {
      host: this.MEILI_HOST,
      port: this.MEILI_PORT,
      masterKey: this.MEILI_MASTER_KEY,
      fullHost: `${this.MEILI_HOST}:${this.MEILI_PORT}`,
    }
  }

  get jwt(): string {
    return this.JWT_SECRET;
  }

  get sentry(): string | null {
    return this.SENTRY_DSN;
  }
}
