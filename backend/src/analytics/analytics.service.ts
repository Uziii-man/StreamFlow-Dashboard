import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly redisService: RedisService) {}

  async getCurrentData(): Promise<any> {
    const temperatureKey = 'temperature:*';
    const humidityKey = 'humidity:*';
    const productCountKey = 'product-count:*';

    const latestTemperature = await this.getLatestValue(temperatureKey);
    const latestHumidity = await this.getLatestValue(humidityKey);
    const latestProductCount = await this.getLatestValue(productCountKey);

    return {
      temperature: latestTemperature,
      humidity: latestHumidity,
      productCount: latestProductCount,
    };
  }

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

  async getMaxHourlyAverage(): Promise<any> {
    const hourlyAverage = await this.calculateHourlyAverage();

    return {
      maxTemperature: Math.max(...hourlyAverage.temperature),
      maxHumidity: Math.max(...hourlyAverage.humidity),
      maxProductCount: Math.max(...hourlyAverage.productCount),
    };
  }

  private async getLatestValue(pattern: string): Promise<number | null> {
    const keys = await this.redisService.keys(pattern);
    if (!keys.length) return null;

    const latestKey = keys.sort().pop();
    const value = latestKey ? await this.redisService.get(latestKey) : null;
    return value ? value.value : null;
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