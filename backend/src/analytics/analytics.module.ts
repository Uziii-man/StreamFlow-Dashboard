import { Module } from '@nestjs/common';
import { CurrentService } from './current.service';
import { HourlyAverageService } from './hourly-average.service';
import { MaxAverageService } from './max-average.service';
import { AnalyticsController } from './analytics.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CurrentService, HourlyAverageService, MaxAverageService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}