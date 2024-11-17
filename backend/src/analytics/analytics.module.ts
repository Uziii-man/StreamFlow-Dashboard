import { Module } from '@nestjs/common';
import { CurrentService } from './current.service';
import { HourlyAverageService } from './hourly-average.service';
import { MaxAverageService } from './max-average.service';
import { AnalyticsController } from './analytics.controller';
import { RedisService } from 'src/redis/redis.service';

@Module({
  providers: [CurrentService, HourlyAverageService, MaxAverageService, RedisService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
