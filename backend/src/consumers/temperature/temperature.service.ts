import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';

@Injectable()
export class TemperatureService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly redisService: RedisService,
) {}

  async onModuleInit() {
    await this.consumerService.consumer(
      'temperature-group', // group ID
      { topics: ['sensor-data'] }, // subscribe to topic
      {
        eachMessage: async ({ message }) => {
          const key = message.key?.toString();
          const value = JSON.parse(message.value?.toString() || '{}');

          if (key === 'temperature') {
            console.log('Temperature Data Consumed:', value, '\n');
            // Handle temperature data here

            // store data in Redis
            const redisKey = `temperature:${new Date().getTime()}`;
            await this.redisService.set(redisKey, value, 3600); 
          }
        },
      },
    );
  }

  async onApplicationShutdown() {
    console.log('Temperature Consumer shutting down...');
  }
}