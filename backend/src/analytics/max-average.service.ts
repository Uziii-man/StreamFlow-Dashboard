import { Injectable } from '@nestjs/common';
import { HourlyAverageService } from './hourly-average.service';

@Injectable()
export class MaxAverageService {
  constructor(private readonly hourlyAverageService: HourlyAverageService) {}

  async getMaxHourlyAverage(): Promise<any> {
    const hourlyAverage = await this.hourlyAverageService.calculateHourlyAverage();

    return {
      maxTemperature: Math.max(...hourlyAverage.temperature),
      maxHumidity: Math.max(...hourlyAverage.humidity),
      maxProductCount: Math.max(...hourlyAverage.productCount),
    };
  }
}