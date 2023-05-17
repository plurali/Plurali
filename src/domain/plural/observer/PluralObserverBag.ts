import { ConsoleLogger, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PluralObserver } from './PluralObserver';
import { InjectQueue } from '@nestjs/bull';
import { PluralObserverUpdateQueue } from '../utils';
import { Queue } from 'bull';
import { UpdateMemberQueueData } from '../types/queue';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface, PluralConfig } from '@app/Config';
import { PrismaService } from 'nestjs-prisma';
import { FullUser } from '@domain/common/types';

@Injectable()
export class PluralObserverBag implements OnApplicationBootstrap {
  private observers: Map<string, PluralObserver> = new Map();

  private readonly endpoint: string;

  constructor(
    @InjectQueue(PluralObserverUpdateQueue)
    private readonly queue: Queue<UpdateMemberQueueData>,
    private readonly db: PrismaService,
    private readonly logger: ConsoleLogger,
    readonly config: ConfigService<ConfigInterface>
  ) {
    this.logger.setContext(this.constructor.name);
    this.endpoint = config.get<PluralConfig>('plural').socketEndpoint;
  }

  async onApplicationBootstrap() {
    await this.init();
  }

  public async init() {
    this._destroyAll();

    this.logger.log('Initializing websocket observers');

    const users = await this.db.user.findMany({
      include: {
        system: true,
      },
    });

    for (const user of users) {
      await this._create(user);
    }
  }

  public teardown() {
    this._destroyAll();
  }

  public async updateUser(user: FullUser, remove = false): Promise<void> {
    this._destroy(user);
    if (!remove) {
      await this._create(user);
    }
  }

  public get(user: FullUser): PluralObserver | null {
    if (!user.system) return null;
    return this.observers.get(user.system.id) ?? null;
  }

  public async _create(user: FullUser): Promise<PluralObserver | null> {
    // Because WS does not emit friend events (at least for now) we can't observe system overrides.
    if (!user || !user.pluralAccessToken || !user.system || user.pluralOverride) return null;

    try {
      if (this.observers.get(user.id)) {
        this.observers.delete(user.id);
      }

      const watcher = new PluralObserver(
        {
          ...user.system,
          user,
        },
        this.queue,
        this.endpoint,
        this.logger
      );
      watcher.client.connect();

      this.observers.set(user.id, watcher);
      return watcher;
    } catch (e) {
      this.logger.error(
        `[watcher-bag] failed to create a watcher for ${user.id}:`,
        (e as any)?.message ?? 'unknown cause'
      );
      return null;
    }
  }

  private _destroy(user: FullUser): void {
    const observer = this.get(user);
    if (observer) {
      observer.client.destroy();
      this.observers.delete(observer.system.id);
    }
  }

  private _destroyAll(): void {
    this.logger.log('Destroying all existing observers');
    for (const observer of this.observers.values()) {
      observer.client.destroy();
    }

    this.observers.clear();
  }
}
