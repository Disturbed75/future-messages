import { IMessagesApiService } from '../messages-api.service';
import {
  ConsoleLogger,
  HttpStatus,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { IMessagesService } from '../messages.service';
import { ApiResponseDto } from '../../../common/dto';
import { ScheduleMessageResponseDto } from '../../dto/schedule-message-response.dto';
import { ScheduledMessage } from '../../model';

export class MessagesSchedulerApiService implements IMessagesApiService {
  constructor(
    @Inject(IMessagesService) private readonly messageService: IMessagesService,
    private readonly logger: ConsoleLogger,
  ) {}

  public async echoAtTime(
    time: string,
    msg: string,
  ): Promise<ApiResponseDto<ScheduleMessageResponseDto>> {
    try {
      const scheduledMessage: ScheduledMessage =
        await this.messageService.scheduleMessageForTime(time, msg);
      return {
        statusCode: HttpStatus.CREATED,
        data: {
          msg: `Your message was scheduled for ${scheduledMessage.time}`,
        },
      };
    } catch (e) {
      this.logger.error(e.message, MessagesSchedulerApiService.name);
      throw new InternalServerErrorException(e.message);
    }
  }
}
