import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HourlyAverageService {
  constructor(private readonly redisService: RedisService) {}

  async calculateHourlyAverage(): Promise<any> {
    const oneHourAgo = Date.now() - 3600000;

    const temperatureValues = await this.getValuesSince('temperature:*', oneHourAgo);
    const humidityValues = await this.getValuesSince('humidity:*', oneHourAgo);
    const productCountValues = await this.getValuesSince('product-count:*', oneHourAgo);

    return {
      temperature: this.calculateAverage(temperatureValues),
      humidity: this.calculateAverage(humidityValues),
      productCount: this.calculateAverage(productCountValues),
    };
  }

  private async getValuesSince(pattern: string, timestampLimit: number): Promise<number[]> {
    const keys = await this.redisService.keys(pattern);
    const filteredKeys = keys.filter((key) => {
      const timestamp = parseInt(key.split(':').pop()!);
      return timestamp >= timestampLimit;
    });

    const values = await Promise.all(filteredKeys.map((key) => this.redisService.get(key)));
    return values.map((val) => JSON.parse(val).value);
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((acc, val) => acc + val, 0) / values.length;
  }
}
