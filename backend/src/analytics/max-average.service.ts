import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MaxAverageService {
  constructor(private readonly redisService: RedisService) {}

  async getMaxHourlyAverage(): Promise<any> {
    const temperatureKey = 'temperature:*';
    const humidityKey = 'humidity:*';
    const productCountKey = 'product-count:*';

    const maxTemperatureAvg = await this.getMaxAverage(temperatureKey);
    const maxHumidityAvg = await this.getMaxAverage(humidityKey);
    const maxProductCountAvg = await this.getMaxAverage(productCountKey);

    return {
      maxTemperatureAvg,
      maxHumidityAvg,
      maxProductCountAvg,
    };
  }

  private async getMaxAverage(pattern: string): Promise<number> {
    const keys = await this.redisService.keys(pattern);
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;

    // Filter keys within the last hour
    const recentKeys = keys.filter((key) => {
      const timestamp = parseInt(key.split(':')[1], 10);
      return timestamp >= oneHourAgo && timestamp <= now;
    });

    if (!recentKeys.length) return 0;

    // Fetch values
    const values = await Promise.all(
      recentKeys.map((key) => this.redisService.get(key)),
    );

    // Calculate maximum
    const maxValue = values.reduce(
      (max, val) => (val && val.value > max ? val.value : max),
      0,
    );
    return maxValue;
  }
}

