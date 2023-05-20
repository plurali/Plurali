import { StorageService } from '../StorageService';
import {
  S3Client,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  NotFound,
  _Object as Obj,
} from '@aws-sdk/client-s3';
import { StoreResult } from '../StoreResult';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@app/Config';
import { StoragePrefix } from '../StoragePrefix';
import { DigitalOceanService } from '@infra/digitalocean/DigitalOceanService';

@Injectable()
export class S3StorageService implements StorageService<S3Client> {
  public readonly client: S3Client;

  public readonly root: string;

  constructor(config: ConfigService<Config>, private readonly provider: DigitalOceanService) {
    const s3 = config.get('storage', { infer: true });

    this.client = new S3Client({
      forcePathStyle: true,
      endpoint: s3.endpoint,
      region: s3.region,
      credentials: {
        accessKeyId: s3.accessKeyId,
        secretAccessKey: s3.accessKeySecret,
      },
    });

    this.root = s3.bucket;
  }

  async ensureInitialIntegrity(): Promise<void> {
    const res = await this.client.send(
      new HeadBucketCommand({
        Bucket: this.root,
      })
    );

    /**
     * HeadBucket is a HEAD request that either returns 200 OK,
     * or 400/403/404 depending on why the bucket is inaccessible to us.
     */
    if (res.$metadata.httpStatusCode !== 200) {
      throw new Error(`Bucket ${this.root} is not accessible`);
    }
  }

  public path(...prefixes: (StoragePrefix | string)[]): string {
    return (
      prefixes
        // Remove forward and trailing slashes first
        .map(prefix => {
          if (prefix.startsWith('/')) prefix = prefix.substring(1);
          if (prefix.endsWith('/')) prefix = prefix.substring(0, prefix.length - 1);
          return prefix;
        })
        .join('/')
    );
  }

  public async list(prefix?: StoragePrefix | string | null): Promise<Obj[]> {
    return (
      await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.root,
          Prefix: `${prefix}/`,
        })
      )
    ).Contents;
  }

  public async exists(path: string): Promise<boolean> {
    try {
      return (
        (
          await this.client.send(
            new HeadObjectCommand({
              Bucket: this.root,
              Key: path,
            })
          )
        ).$metadata.httpStatusCode === 200
      );
    } catch (error) {
      if (error instanceof NotFound) {
        return false;
      }

      throw error;
    }
  }

  public async store(path: string, body: Buffer, replaceIfExists = false, acl = 'public-read'): Promise<StoreResult> {
    let cacheFail = false;
    if (await this.exists(path)) {
      if (!replaceIfExists) throw new Error(`'${path}' already exists`);

      await this.delete(path);
      cacheFail = await this.provider.clearCdnCache(path);
    }

    return {
      ok:
        (
          await this.client.send(
            new PutObjectCommand({
              Bucket: this.root,
              Key: path,
              ACL: acl,
              Body: body,
              ContentLength: body.byteLength,
            })
          )
        ).$metadata.httpStatusCode === 200,
      cacheFail,
    };
  }

  public async delete(path: string): Promise<boolean> {
    return (
      (
        await this.client.send(
          new DeleteObjectCommand({
            Bucket: this.root,
            Key: path,
          })
        )
      ).$metadata.httpStatusCode === 200
    );
  }
}
