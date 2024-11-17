import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class HourlyAverageService {
  constructor(private readonly redisService: RedisService) {}

  async calculateHourlyAverage(): Promise<any> {
    const temperatureKey = 'temperature:*';
    const humidityKey = 'humidity:*';
    const productCountKey = 'product-count:*';

    const temperatureAvg = await this.getHourlyAverage(temperatureKey);
    const humidityAvg = await this.getHourlyAverage(humidityKey);
    const productCountAvg = await this.getHourlyAverage(productCountKey);

    return {
      temperatureAvg,
      humidityAvg,
      productCountAvg,
    };
  }

  private async getHourlyAverage(pattern: string): Promise<number> {
    const keys = await this.redisService.keys(pattern);
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;

    // Filter keys within the last hour
    const recentKeys = keys.filter((key) => {
      const timestamp = parseInt(key.split(':')[1], 10);
      return timestamp >= oneHourAgo && timestamp <= now;
    });

    if (!recentKeys.length) return 0;

    // Fetch values and calculate average
    const values = await Promise.all(
      recentKeys.map((key) => this.redisService.get(key)),
    );

    const sum = values.reduce((acc, val) => acc + (val ? val.value : 0), 0);
    return sum / values.length;
  }
}

