import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class HourlyAverageService {
  private readonly CACHE_TTL = 15; // Cache for 15 seconds

  constructor(private readonly redisService: RedisService) {}

  async calculateHourlyAverage(): Promise<any> {
    const temperatureAvg = await this.calculateAverageForKey('temperature:*', 'temperature');
    const humidityAvg = await this.calculateAverageForKey('humidity:*', 'humidity');
    const productCountAvg = await this.calculateAverageForKey('product-count:*', 'productCount');

    return {
      temperatureAvg,
      humidityAvg,
      productCountAvg,
    };
  }

  private async calculateAverageForKey(pattern: string, field: string): Promise<number> {
    const now = Date.now();
    const cacheKey = `average:${field}`;

    // Check if a cached value exists
    const cachedValue = await this.redisService.get<{ [key: string]: number }>(cacheKey);
    if (cachedValue && cachedValue[field] !== undefined) {
      return cachedValue[field];
    }

    // Calculate the time range for the
    const oneHourAgo = now - 3600 * 1000;

    // Fetch keys matching the pattern
    const keys = await this.redisService.keys(pattern);

    // Filter keys within the last hour
    const relevantKeys = keys.filter((key) => {
      const timestamp = parseInt(key.split(':')[1], 10);
      return !isNaN(timestamp) && timestamp >= oneHourAgo && timestamp <= now;
    });

    const finalKeys = relevantKeys.length > 0 ? relevantKeys : keys;

    // Fetch values for the selected keys
    const values = await Promise.all(
      finalKeys.map((key) => this.redisService.get(key)),
    );

    const parsedValues = values
      .filter((value) => value !== null)
      .map((value) => value[field]);

    if (!parsedValues.length) return 0;

    // Calculate the average
    const sum = parsedValues.reduce((acc, val) => acc + val, 0);
    const average = Math.round((sum / parsedValues.length) * 100) / 100;

    // Cache the average
    await this.redisService.set(cacheKey, { [field]: average }, this.CACHE_TTL);

    return average;
  }
}

