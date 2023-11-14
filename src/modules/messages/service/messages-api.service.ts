import { ApiResponseDto } from '../../common/dto';
import { ScheduleMessageResponseDto } from '../dto/schedule-message-response.dto';

export interface IMessagesApiService {
  echoAtTime(
    time: string,
    msg: string,
  ): Promise<ApiResponseDto<ScheduleMessageResponseDto>>;
}

export const IMessagesApiService = Symbol.for('IMessagesApiService');
