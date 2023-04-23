import { User } from '@prisma/client';
import { Watcher } from './index.js';
import { $db } from '../../services/db/index.js';
import { getMe } from '@plurali/common/dist/plural/index.js';

export class WatcherBag {
  private watchers: Map<string, Watcher> = new Map();

  public async init() {
    this.destroyAll();

    const users = await $db.user.findMany({
      where: {
        pluralKey: {
          not: null,
        },
      },
    });

    for (const user of users) {
      await this.createFor(user);
    }
  }

  public connectAll() {
    for (const watcher of this.watchers.values()) {
      watcher.destroy();
    }
  }

  public destroyAll() {
    for (const watcher of this.watchers.values()) {
      watcher.destroy();
    }
  }

  public async createFor(id: User | string): Promise<Watcher | null> {
    const user = typeof id === 'string' ? await $db.user.findUnique({ where: { id } }) : id;

    // Because WS does not emit friend events (at least for now), Watcher can't work with overrides.
    if (!user || user.overridePluralId) return;

    try {
      if (this.watchers.get(user.id)) {
        this.watchers.delete(user.id);
      }

      const system = await getMe({
        user,
      });

      const watcher = new Watcher(user, system.data.id);
      await watcher.connect();

      this.watchers.set(user.id, watcher);
      return watcher;
    } catch (e) {
      console.error(`[watcher-bag] failed to create a watcher for ${user.id}:`, e?.message ?? 'unknown cause');
      return null;
    }
  }

  public get(id: string | User): Watcher | null {
    if (typeof id === 'string') return this.watchers.get(id) ?? null;
    return this.get(id.id);
  }

  public connect(id: string | User): Watcher | null {
    return this.get(id)?.connect();
  }

  public destroy(id: string | User): void {
    const watcher = this.get(id);
    if (watcher) {
      watcher.destroy();
      this.watchers.delete(watcher.getUser().id);
    }
  }

  public async updateUser(user: User): Promise<Watcher | null> {
    const watcher = this.get(user);
    if (!watcher) {
      return await this.createFor(user);
    }

    return watcher.updateUser(user);
  }
}

export const $watcherBag = new WatcherBag();
