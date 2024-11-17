import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MaxAverageService {
  constructor(private readonly redisService: RedisService) {}

  async getMaxHourlyAverage(): Promise<any> {
    const maxTemperatureAvg = await this.getMaxAverageForKey('temperature:*');
    const maxHumidityAvg = await this.getMaxAverageForKey('humidity:*');
    const maxProductCountAvg = await this.getMaxAverageForKey('product-count:*');

    return {
      maxTemperatureAvg,
      maxHumidityAvg,
      maxProductCountAvg,
    };
  }

  private async getMaxAverageForKey(pattern: string): Promise<number | null> {
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;

    // Fetch all matching keys
    const keys = await this.redisService.keys(pattern);

    // Filter keys within the last hour
    const relevantKeys = keys.filter((key) => {
      const timestamp = parseInt(key.split(':')[1], 10);
      return !isNaN(timestamp) && timestamp >= oneHourAgo && timestamp <= now;
    });

    if (!relevantKeys.length) {
      console.log(`No data found for pattern: ${pattern}`);
      return 0; // Return 0 if no data is found
    }

    // Fetch values for the relevant keys
    const values = await Promise.all(
      relevantKeys.map((key) => this.redisService.get(key))
    );

    // Extract numeric values and find the maximum
    const parsedValues = values
      .filter((value) => value !== null)
      .map((value) => value.value);

    if (!parsedValues.length) return 0;

    return Math.max(...parsedValues);
  }
}


