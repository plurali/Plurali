import { User } from '@prisma/client';
import WebSocket from 'ws';
import { Message, OperationType } from '@plurali/common/dist/plural';
import { $server } from '../../server';
import EventEmitter from 'eventemitter3';
import { clearMemberListCache } from '../../services/redis/utils';
import { $db } from '../../services/db';
import { getMembers } from '../../plural/cached';
import { $redis } from '../../services/redis';

export class Watcher extends EventEmitter {
  private connection: WebSocket | null = null;

  private url: string = 'wss://v2.apparyllis.com/v1/socket';

  private shouldConnect: boolean = true;

  private authenticated: boolean = false;

  private promise?: Promise<unknown> = null;

  constructor(private user: User, private systemId: string, private logger = true) {
    super();

    if (logger) {
      const prefix = `[watcher-${this.user.id}]`;
      this.on('connecting', () => $server.log.info(`${prefix} connecting`));
      this.on('connected', () => $server.log.info(`${prefix} connected`));
      this.on('authenticated', () => $server.log.info(`${prefix} authenticated`));
      this.on('ping', () => $server.log.info(`${prefix} sent ping`));
      this.on('pong', () => $server.log.info(`${prefix} got pong`));
      this.on('update', (target: string, id: string, op: OperationType) =>
        $server.log.info(`${prefix} update of ${target}(${id}) of type ${op}`)
      );
      this.on('destroyed', () => $server.log.info(`${prefix} destroyed`));
    }
  }

  public connect(): Watcher {
    if (this.connection) {
      this.destroy();
    }

    this.emit('connecting');
    $server.log.info(`[watcher-${this.user.id}] connecting to ws`);

    this.connection = new WebSocket(this.url);

    this.connection.addEventListener(
      'open',
      event => {
        this.emit('connected');
        if (!this.shouldConnect) return;
        event.target.addEventListener('message', event => {
          if (event.data === '{}') {
            this.authenticate(event.target);
          }
        });
      },
      { once: true }
    );

    this.connection.addEventListener('message', event => {
      if (!this.shouldConnect || !this.authenticated || event.data === 'pong') return;

      const message = this._safeMessage(event.data);
      if (!message) return;

      this._messagePromise(message);
    });

    this.connection.addEventListener(
      'close',
      () => {
        if (!this.shouldConnect) return;
        this.connect();
      },
      { once: true }
    );

    return this;
  }

  public destroy(): Watcher {
    this.shouldConnect = false;
    this.connection.removeAllListeners();
    this.connection.close(0);
    this.connection = null;
    this.promise = null;
    this.emit('destroyed');
    return this;
  }

  public getUser(): User {
    return this.user;
  }

  public getSystemId(): string {
    return this.systemId;
  }

  public getConnection(): WebSocket | null {
    return this.connection;
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public updateUser(newUser: User): Watcher {
    // Key changed
    if (newUser.pluralKey !== this.user.pluralKey) {
      this.connect();
    }

    this.user = newUser;

    return this;
  }

  public updateSystemId(systemId: string): Watcher {
    this.systemId = systemId;

    return this;
  }

  private authenticate(target?: WebSocket) {
    target.addEventListener(
      'message',
      event => {
        const message = this._safeMessage(event.data);
        if (!message) return;

        if (message.msg === 'Successfully authenticated') {
          this.emit('authenticated');
          this.authenticated = true;

          this._keepAlive(event.target);
        }
      },
      { once: true }
    );

    this._json({ op: 'authenticate', token: this.user.pluralKey }, target);
  }

  private async handleMessage<T extends Message = Message>(message: T): Promise<void> {
    if (!this.shouldConnect || !this.authenticated) return;

    if (message.msg === 'update') {
      const transaction = $redis.multi();

      if (message.target === 'members') {
        await clearMemberListCache(this.systemId, transaction);

        for (const member of message.results) {
          this.emit('update', message.target, member.id, member.operationType);
          if (member.operationType === OperationType.Delete) {
            await $db.userMember.deleteMany({
              where: {
                pluralOwnerId: this.systemId,
                pluralId: member.id,
              },
            });
          }
        }

        // Call the cached endpoint which will automatically cache
        // the MemberList & each Member
        await getMembers({
          user: this.user,
          systemId: this.systemId
        });
      }

      await transaction.exec();
    }
  }

  /**
   * This weirdness of a code ensures that all messages are handles one after another,
   * not in parallel, because writing data in parallel could cause data corruption if for ex.
   * client recieves one message and starts handling it while soonafter it will receive another message
   * before finishing handling the first one.
   */
  private _messagePromise<T extends Message = Message>(message: T) {
    if (!this.shouldConnect) return;
    if (!this.promise) {
      this.promise = this.handleMessage(message);
      this.promise.finally(() => (this.promise = null));
    } else {
      this.promise.finally(() => this._messagePromise(message));
    }
  }

  private _safeMessage<T extends Message = Message>(data: unknown): T {
    try {
      return this._message(String(data));
    } catch {
      console.log(`[ws] received invalid data for Plurali${this.user.id}/SP${this.systemId}`);
      return null;
    }
  }

  private _message<T = Message>(data: string): T {
    return JSON.parse(data) as T;
  }

  private _json(data: unknown, target?: WebSocket): void {
    return (target ?? this.connection)?.send(JSON.stringify(data));
  }

  private _keepAlive(target?: WebSocket): void {
    const ws = target ?? this.connection;

    if (!ws || !this.shouldConnect || !this.authenticated) return;

    ws.addEventListener(
      'message',
      event => {
        if (event.data === 'pong') {
          // Send ping every 60s
          this.emit('pong');
          setTimeout(() => this._keepAlive(target), 60 * 1000);
        }
      },
      { once: true }
    );

    this.emit('ping');
    ws.send('ping');
  }
}
