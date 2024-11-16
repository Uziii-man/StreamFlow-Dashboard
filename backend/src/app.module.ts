import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { CronModule } from './cron/cron.module';
import { ConsumersModule } from './consumers/consumers.module';
import { RedisModule } from './redis/redis.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    KafkaModule, 
    CronModule, 
    ConsumersModule, 
    RedisModule, 
    AnalyticsModule
  ],
})
export class AppModule {}
