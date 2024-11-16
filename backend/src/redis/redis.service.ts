import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      url: 'redis://localhost:6379', // Change the URL if Redis runs elsewhere
    });
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

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  //newly added
  async keys(pattern: string): Promise<string[]> {
    // Use the SCAN command to match keys
    const keys: string[] = [];
    const iterator = this.redisClient.scanIterator({ MATCH: pattern });

    for await (const key of iterator) {
      keys.push(key);
    }

    return keys;
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}