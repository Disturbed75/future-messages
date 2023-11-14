import { ScheduledMessage } from '../model';

export interface IMessagesService {
  scheduleMessageForTime(time: string, msg: string): Promise<ScheduledMessage>;
  processChannelMessage(channel: string, msg: string): Promise<void>;
  processMissedMessages(): Promise<void>;
}

export const IMessagesService = Symbol.for('IMessagesService');
