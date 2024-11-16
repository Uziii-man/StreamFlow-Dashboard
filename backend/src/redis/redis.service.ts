import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private readonly redisClient = createClient({
    url: 'redis://localhost:6379', // Change if Redis is on another host/port
  });

  constructor() {
    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    this.redisClient.connect().then(() => {
      console.log('Connected to Redis');
    });
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, stringValue, { EX: ttl }); // setting with expiration
    } else {
      await this.redisClient.set(key, stringValue); // setting without expiration
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}