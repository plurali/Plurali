import {
  HeadBucketCommand,
  ListObjectsV2Command,
  S3Client,
  _Object as Obj,
  PutObjectCommand,
  HeadObjectCommand,
  NotFound,
  GetObjectCommand,
  PutObjectCommandInputType,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { $env } from '../../utils/env.js';

export enum S3Prefix {
  Userdata = '@userdata',
}

export class Storage {
  public s3: S3Client = new S3Client({
    forcePathStyle: true,
    endpoint: $env.orFail('S3_ENDPOINT'),
    region: $env.orFail('S3_REGION'),
    credentials: {
      accessKeyId: $env.orFail('S3_ACCESS_KEY_ID'),
      secretAccessKey: $env.orFail('S3_ACCESS_KEY_SECRET'),
    },
  });

  public bucketName: string = $env.orFail('S3_BUCKET');

  /**
   * @internal only meant for initial run!
   */
  public async ensureInitialIntegrity() {
    const res = await this.s3.send(
      new HeadBucketCommand({
        Bucket: this.bucketName,
      })
    );

    /**
     * HeadBucket is a HEAD request that either returns 200 OK,
     * or 400/403/404 depending on why the bucket is inaccessible to us.
     */
    if (res.$metadata.httpStatusCode !== 200) {
      throw new Error(`Bucket ${this.bucketName} is not accessible`);
    }

    // TODO (?)
  }

  public path(...prefixes: (S3Prefix | string)[]): string {
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

  public async list(prefix?: S3Prefix | string | null): Promise<Obj[]> {
    return (
      await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: `${prefix}/`,
        })
      )
    ).Contents;
  }

  public async exists(path: string): Promise<boolean> {
    try {
      return (
        (
          await this.s3.send(
            new HeadObjectCommand({
              Bucket: this.bucketName,
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

  public async get(path: string): Promise<boolean> {
    try {
      return (
        (
          await this.s3.send(
            new GetObjectCommand({
              Bucket: this.bucketName,
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

  public async store(
    path: string,
    body: Buffer,
    replaceIfExists = false,
    acl = 'public-read'
  ): Promise<boolean> {
    if ((await this.exists(path)) && !replaceIfExists) {
      throw new Error(`'${path}' already exists`);
    }

    return (
      (
        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: path,
            ACL: acl,
            Body: body,
            ContentLength: body.byteLength 
          })
        )
      ).$metadata.httpStatusCode === 200
    );
  }

  public async delete(path: string, replaceIfExists = false): Promise<boolean> {
    if ((await this.exists(path)) && !replaceIfExists) {
      throw new Error(`'${path}' already exists`);
    }

    return (
      (
        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: path,
          })
        )
      ).$metadata.httpStatusCode === 200
    );
  }
}

export const $storage = new Storage();
