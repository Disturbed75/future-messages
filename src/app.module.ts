import { Module } from '@nestjs/common';
import { MessagesModule } from './modules/messages/messages.module';
import { RedisConnectionModule } from './modules/redis-connection/redis-connection.module';
import { ConfigurationsModule } from './modules/configurations/configuration.module';

@Module({
  imports: [ConfigurationsModule, RedisConnectionModule, MessagesModule],
})
export class AppModule {}
