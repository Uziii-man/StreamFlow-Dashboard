import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, Reflector } from '@nestjs/core';

import { TemperatureService } from './temperature/temperature.service';
import { HumidityService } from './humidity/humidity.service';
import { ProductCountService } from './product-count/product-count.service';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    KafkaModule,
  ], 
  providers: [
    Reflector,
    TemperatureService, 
    HumidityService, 
    ProductCountService,
  ],
})
export class CronModule {}
