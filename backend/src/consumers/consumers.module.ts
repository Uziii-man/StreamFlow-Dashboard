import { Module } from '@nestjs/common';
import { TemperatureService } from './temperature/temperature.service';
import { HumidityService } from './humidity/humidity.service';
import { ProductCountService } from './product-count/product-count.service';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    ConsumerService,
    TemperatureService, 
    HumidityService, 
    ProductCountService
  ]
})
export class ConsumersModule {}
