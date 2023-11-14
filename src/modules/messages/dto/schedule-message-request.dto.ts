import { IsString, Matches, MaxLength } from 'class-validator';
import { MAX_MSG_LENGTH, TIME_FORMAT_REG_EXP } from '../messages.constant';

export class ScheduleMessageRequestDto {
  @IsString()
  @Matches(TIME_FORMAT_REG_EXP, {
    message: 'Invalid time format. Please use hh:mm:ss',
  })
  time: string;

  @IsString()
  @MaxLength(MAX_MSG_LENGTH, {
    message: `Mgs is too long. Maximum length is ${MAX_MSG_LENGTH} characters.`,
  })
  msg: string;
}
