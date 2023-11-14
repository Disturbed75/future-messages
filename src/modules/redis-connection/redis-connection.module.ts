import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import {
  REDIS_PUB_CONNECTION,
  REDIS_SUB_CONNECTION,
} from './redis-connection.constant';

import * as process from 'process';
import { ConfigurationsModule } from '../configurations/configuration.module';

@Module({
  imports: [
    ConfigurationsModule,
    RedisModule.forRoot(
      { config: { url: process.env.REDIS_URL } },
      REDIS_SUB_CONNECTION,
    ),
    RedisModule.forRoot(
      { config: { url: process.env.REDIS_URL } },
      REDIS_PUB_CONNECTION,
    ),
  ],
})
export class RedisConnectionModule {}
