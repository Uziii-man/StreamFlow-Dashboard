import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CurrentService {
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


  private async getLatestValue(pattern: string): Promise<number | null> {
    const keys = await this.redisService.keys(pattern);
    if (!keys.length) return null;
  
    const latestKey = keys.sort().pop();
    // const value = latestKey ? await this.redisService.get(latestKey) : null;

    const value = latestKey ? await this.redisService.get<{ value: number }>(latestKey) : null;
    return value ? value.value : null;
  }
}