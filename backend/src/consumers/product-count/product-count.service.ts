import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';

@Injectable()
export class ProductCountService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly redisService: RedisService,
) {}

  async onModuleInit() {
    await this.consumerService.consumer(
      'product-count-group', // Unique group ID
      { topics: ['sensor-data'] }, // Subscribe to topic
      {
        eachMessage: async ({ message }) => {
          const key = message.key?.toString();
          const value = JSON.parse(message.value?.toString() || '{}');

          if (key === 'product-count') {
            // console.log('Product Count Data Consumed:', value, '\n');
            // Handle product-count data here

            // store data in Redis
            const redisKey = `product-count:${new Date().getTime()}`;
            await this.redisService.set(redisKey, value, 3600); 
          }
        },
      },
    );
  }

  async onApplicationShutdown() {
    console.log('Product Count Consumer shutting down...');
  }
}