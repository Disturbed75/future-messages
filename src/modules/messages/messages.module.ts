import { ConsoleLogger, Inject, Module, OnModuleInit } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  REDIS_EXP_EVENT_CHANNEL,
  REDIS_SUB_CONNECTION,
} from '../redis-connection/redis-connection.constant';
import {
  IMessagesApiService,
  IMessagesService,
  MessagesSchedulerApiService,
  MessagesSchedulerService,
} from './service';

@Module({
  imports: [],
  controllers: [MessagesController],
  providers: [
    { provide: ConsoleLogger, useClass: ConsoleLogger },
    { provide: IMessagesService, useClass: MessagesSchedulerService },
    {
      provide: IMessagesApiService,
      useClass: MessagesSchedulerApiService,
    },
  ],
})
export class MessagesModule implements OnModuleInit {
  constructor(
    @InjectRedis(REDIS_SUB_CONNECTION) private readonly subscriber: Redis,
    @Inject(IMessagesService) private readonly messageService: IMessagesService,
    private readonly logger: ConsoleLogger,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.processMissedMessages();
    await this.subscribeToExpiredEvents();
  }

  private async subscribeToExpiredEvents(): Promise<void> {
    await this.subscriber.subscribe(REDIS_EXP_EVENT_CHANNEL);
    this.logger.log(
      `Subscribed to ${REDIS_EXP_EVENT_CHANNEL}`,
      MessagesModule.name,
    );
    this.subscriber.on(
      'message',
      this.messageService.processChannelMessage.bind(this.messageService),
    );
  }

  private async processMissedMessages(): Promise<void> {
    await this.messageService.processMissedMessages();
  }
}
