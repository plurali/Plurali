import EventEmitter from "eventemitter2";
import { safeStringify } from './safeStringify';
import { Message, UpdateMessage } from './types/socket';

export interface PluralSocketClientEvent<D = object> {
  data: D;
  socket: WebSocket;
  isUsable: () => boolean;
}

export interface LoggerInterface {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

// ready | message | update | closed | hopeless
export class PluralSocketClient extends EventEmitter {
  private _socket: WebSocket | null = null;

  public readonly logger: LoggerInterface;

  // Internal emitter
  private readonly _emitter: EventEmitter = new EventEmitter();

  private _destroyed = false;

  private _authenticated = false;

  private _retryAttempts = 0;

  private static readonly RETRY_ATTEMPTS: number = 10;

  private static readonly PING_TIMEOUT: number = 60;

  constructor(
    private readonly token: string,
    private readonly endpoint: string,
    logger?: LoggerInterface,
  ) {
    super();

    this.logger = logger ?? console;

    this.init();
  }

  private init() {
    this._emitter.on('opened', (socket: WebSocket) => {
      if (!this._isUsable(socket)) return;

      this._retryAttempts = 0;

      this._authenticate(socket);
    });

    this._emitter.on('authenticated', (socket: WebSocket) => {
      if (!this._isUsable(socket)) return;

      this._authenticated = true;
      this.emit('ready');

      socket.addEventListener('message', ({ data }) => {
        if (!this._isAuthenticated(socket)) return;

        const parsedData = this._parse<Message>(data);
        if (!parsedData || !('msg' in parsedData)) return;

        const event: PluralSocketClientEvent<Message> = {
          data: parsedData,
          socket,
          isUsable: () => this._isAuthenticated(socket),
        };

        this.emit('message', event);

        if (event.data.msg === 'update') {
          this.emit('update', event.data);
        }
      });
    });

    this._emitter.on('pong', (socket: WebSocket) => {
      if (!this._isAuthenticated(socket)) return;

      // Send 'pong' every 60s
      setTimeout(() => this._isAuthenticated(socket) && this._ping(socket), PluralSocketClient.PING_TIMEOUT * 1000);
    });

    this._emitter.on('closed', (socket: WebSocket) => {
      if (socket !== this._socket) return;

      this._socket = null;
      this._authenticated = false;

      this.emit('closed');

      if (this._destroyed) return;

      this._retryAttempts++;

      if (this._retryAttempts > PluralSocketClient.RETRY_ATTEMPTS) {
        this.logger.warn(`Gave up after ${this._retryAttempts}`);
        this._destroyed = true;

        this.emit('hopeless');
        return;
      }

      this.connect();
    });
  }

  onMessage<D extends Message = Message>(listener: (event: PluralSocketClientEvent<D>) => unknown): this {
    this._emitter.on('message', listener);
    return this;
  }

  onUpdate<D extends UpdateMessage = UpdateMessage>(listener: (event: PluralSocketClientEvent<D>) => unknown): this {
    this._emitter.on('update', listener);
    return this;
  }

  connect(): WebSocket {
    if (this._socket) {
      this.destroy();
    }

    const socket = new WebSocket(this.endpoint);

    socket.addEventListener(
      'open',
      () => {
        if (!this._isUsable(socket)) return;

        socket.addEventListener(
          'message',
          ({ data }) => {
            if (this._isUsable(socket) && data === '{}') {
              this._emitter.emit('opened', socket);
            }
          },
          { once: true },
        );

        socket.addEventListener('close', () => {
          this._emitter.emit('closed');
        });
      },
      { once: true },
    );

    return (this._socket = socket);
  }

  /**
   * Note: Destroy does not detach listeners, though no events will be called after destroy() is called.
   */
  destroy(): void {
    if (this._destroyed) return;

    // Dont do anything past this point.
    this._destroyed = true;

    if (this._isUsable(this._socket)) {
      this._socket?.close();
    }
  }

  isDestroyed(): boolean {
    return this._destroyed;
  }

  isAuthenticated(): boolean {
    return this._authenticated;
  }

  getSocket(): WebSocket | null {
    return this._socket;
  }

  private _isUsable(socket: WebSocket | null): boolean {
    return !this._destroyed && socket?.readyState === 1 && socket === this._socket;
  }

  private _isAuthenticated(socket: WebSocket): boolean {
    return this._isUsable(socket) && this._authenticated;
  }

  private _authenticate(socket: WebSocket): void {
    socket.addEventListener(
      'message',
      ({ data }) => {
        if (!this._isUsable(socket)) return;

        const message = this._parse(data);
        if (!message) return;

        if ('msg' in message && message.msg === 'Successfully authenticated') {
          this._emitter.emit('authenticated', socket);
        }
      },
      { once: true },
    );

    this._send({ op: 'authenticate', token: this.token }, socket);
  }

  private _ping(socket: WebSocket): void {
    socket.send('ping');
    this._emitter.emit('ping');
  }

  private _parse<D = object>(data: unknown): D | null {
    try {
      if (typeof data !== 'string') throw new Error();

      return JSON.parse(data) as D;
    } catch {
      this.logger.log(`Got invalid response from socket`);
      return null;
    }
  }

  private _send(data: unknown, socket: WebSocket): void {
    return socket.send(typeof data !== 'string' ? safeStringify(data) : data);
  }
}
