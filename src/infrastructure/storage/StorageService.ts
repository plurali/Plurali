import { StoreResult } from './StoreResult';

export abstract class StorageService<T = any> {
  readonly client: T;

  readonly root: string;

  /**
   * @internal only meant for initial run!
   */
  abstract ensureInitialIntegrity(): Promise<void>;

  abstract exists(path: string): Promise<boolean>;

  abstract store(path: string, body: Buffer, replaceIfExists?: boolean, acl?: string): Promise<StoreResult>;

  abstract delete(path: string): Promise<boolean>;
}
