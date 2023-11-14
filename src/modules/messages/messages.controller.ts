import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IMessagesApiService } from './service';
import { ScheduleMessageRequestDto } from './dto';
import { ApiResponseDto } from '../common/dto';
import { ScheduleMessageResponseDto } from './dto/schedule-message-response.dto';

@Controller({ path: '/scheduled-messages' })
export class MessagesController {
  constructor(
    @Inject(IMessagesApiService) private messageApiService: IMessagesApiService,
  ) {}

  @Post()
  public async scheduleMessage(
    @Body() message: ScheduleMessageRequestDto,
  ): Promise<ApiResponseDto<ScheduleMessageResponseDto>> {
    return this.messageApiService.echoAtTime(message.time, message.msg);
  }
}
