import { IMessagesService } from '../messages.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { v4 as uuidv4 } from 'uuid';
import {
  REDIS_EXP_EVENT_CHANNEL,
  REDIS_PUB_CONNECTION,
} from '../../../redis-connection/redis-connection.constant';
import { calculateSecondsTimeDiff } from '../../messages.util';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduledMessage } from '../../model';
import { ScheduleMessageException } from '../../exception';

export class MessagesSchedulerService implements IMessagesService {
  private readonly appServerName: string;

  constructor(
    @InjectRedis(REDIS_PUB_CONNECTION) private readonly redis: Redis,
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService,
  ) {
    this.appServerName = configService.get('APP_SERVER_UNIQUE_NAME');
  }

  public async scheduleMessageForTime(
    time: string,
    msg: string,
  ): Promise<ScheduledMessage> {
    try {
      const id = uuidv4();
      const key = `${this.appServerName}:exp_msg:${id}`;
      const expSeconds = calculateSecondsTimeDiff(time);
      const scheduledMsg: ScheduledMessage = { time, msgTxt: msg };
      const scheduledMsgStr: string = JSON.stringify(scheduledMsg);
      await this.redis
        .multi()
        .set(key, 1, 'EX', expSeconds)
        .set(`${this.appServerName}:msg:${id}`, scheduledMsgStr)
        .exec();
      this.logger.log(
        `Message ${this.appServerName}:msg:${id} published`,
        MessagesSchedulerService.name,
      );
      this.logger.log(
        `Message ${this.appServerName}:exp_msg:${id} published with expiration`,
        MessagesSchedulerService.name,
      );
      return scheduledMsg;
    } catch (e) {
      this.logger.error(e.message, MessagesSchedulerService.name);
      throw new ScheduleMessageException(e.message);
    }
  }

  public async processChannelMessage(
    channel: string,
    msg: string,
  ): Promise<void> {
    try {
      const msgArr = msg.split(':');
      const appServName = msgArr[0];
      const id = msg.split(':')[2];
      if (
        channel === REDIS_EXP_EVENT_CHANNEL &&
        appServName === this.appServerName
      ) {
        const key = `${this.appServerName}:msg:${id}`;
        const fullMsg = await this.redis.get(key);
        const fullMsgObj = JSON.parse(fullMsg);
        this.logger.log(
          `Scheduled for: ${fullMsgObj.time}; Msg: ${fullMsgObj.msgTxt}`,
          MessagesSchedulerService.name,
        );
        await this.redis.del(key);
      }
    } catch (e) {
      this.logger.error(e.message, MessagesSchedulerService.name);
    }
  }

  public async processMissedMessages(): Promise<void> {
    const prefix = `${this.appServerName}:msg*`;
    const stream = this.redis.scanStream({ match: prefix, count: 100 });
    stream.on('data', async (res) => {
      await Promise.all(res.map(this.processMissedMsg.bind(this)));
    });
  }

  private async processMissedMsg(msgKey: string) {
    try {
      const isMissed = await this.isMessageMissed(msgKey);
      if (isMissed) {
        const msg: string = await this.redis.get(msgKey);
        const msgObj = JSON.parse(msg);
        this.logger.log(
          `Scheduled for: ${msgObj.time}; Recovered msg: ${msgObj.msgTxt}`,
          `${this.appServerName}: ${MessagesSchedulerService.name}`,
        );
        await this.redis.unlink(msgKey);
      }
    } catch (e) {
      this.logger.error(
        `Process message ${msgKey} error. ${e.message}`,
        MessagesSchedulerService.name,
      );
    }
  }

  private async isMessageMissed(msgKey: string) {
    const id = msgKey.split(':')[2];
    const key = `${this.appServerName}:exp_msg:${id}`;
    const msg: string | null = await this.redis.get(key);
    return !msg;
  }
}
