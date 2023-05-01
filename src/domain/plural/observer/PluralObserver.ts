import { Queue } from 'bull';
import { ConsoleLogger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PluralSocketClient } from '../PluralSocketClient';
import { UpdateMemberQueueData } from '../types/queue';
import { SystemWithUser } from '@domain/common/types';
import { SocketOperationType } from '../utils';

export class PluralObserver extends EventEmitter2 {
  public readonly client: PluralSocketClient;

  constructor(
    public readonly system: SystemWithUser,
    private readonly queue: Queue<UpdateMemberQueueData>,
    endpoint: string,
    private readonly logger: ConsoleLogger
  ) {
    super();

    this.logger.setContext(`${this.constructor.name}-${this.system.id}/SP${this.system.pluralId}`);
    this.client = new PluralSocketClient(this.system, endpoint, this.logger);

    this.init();
  }

  init() {
    if (this.system.user.pluralOverride) {
      this.logger.warn(`Users with defined override will be ignored`);
    }

    this.client.onUpdate(({ data }) => {
      if (data.target === 'members') {
        this.queue.addBulk(
          data.results.map(operation => ({
            name: 'update.member',
            data: {
              systemId: this.system.id,
              systemPluralId:
                operation.operationType !== SocketOperationType.Delete ? operation.content.uid : this.system.pluralId,
              userId: this.system.userId,
              operation,
            },
          }))
        );
      }
    });
  }
}
