// import { Injectable } from '@nestjs/common';
// import { HourlyAverageService } from './hourly-average.service';
// import { RedisService } from 'src/redis/redis.service';

// @Injectable()
// export class MaxAverageService {
//   private readonly MAX_KEY = 'current-max';

//   constructor(
//     private readonly hourlyAverageService: HourlyAverageService,
//     private readonly redisService: RedisService,
//   ) {}

//   async getMaxHourlyAverage(): Promise<any> {
//     // Fetch the latest averages from HourlyAverageService
//     const currentAverage = await this.hourlyAverageService.calculateHourlyAverage();

//     // Fetch stored maximum values from Redis
//     const storedMax = (await this.redisService.get<{ [key: string]: number }>(this.MAX_KEY)) || {
//       maxTemperatureAvg: 0,
//       maxHumidityAvg: 0,
//       maxProductCountAvg: 0,
//     };

//     // Compare and update the maximum values
//     const updatedMax = {
//       maxTemperatureAvg: Math.max(storedMax.maxTemperatureAvg, currentAverage.temperatureAvg || 0),
//       maxHumidityAvg: Math.max(storedMax.maxHumidityAvg, currentAverage.humidityAvg || 0),
//       maxProductCountAvg: Math.max(storedMax.maxProductCountAvg, currentAverage.productCountAvg || 0),
//     };

//     // Store the updated maximum values back to Redis
//     await this.redisService.set(this.MAX_KEY, updatedMax);

//     // Return the updated maximum values
//     return updatedMax;
//   }
// }


import { Injectable } from '@nestjs/common';
import { HourlyAverageService } from './hourly-average.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MaxAverageService {
  private readonly MAX_KEY = 'current-max';
  private readonly ONE_HOUR = 3600 * 1000;

  constructor(
    private readonly hourlyAverageService: HourlyAverageService,
    private readonly redisService: RedisService,
  ) {}

  async getMaxHourlyAverage(): Promise<any> {
    const now = Date.now();
    const oneHourAgo = now - this.ONE_HOUR;

    // Check if 1 hour is completed
    const firstDataTimestamp = await this.getFirstDataTimestamp();
    const isOneHourCompleted = firstDataTimestamp && firstDataTimestamp <= oneHourAgo;

    if (isOneHourCompleted) {
      console.log('1 hour is completed. Returning calculated max from Redis...');
      return await this.calculateMaxFromRedis(oneHourAgo, now);
    }

    console.log('Less than 1 hour. Returning tracked max values...');
    return await this.trackMaxHourlyAverage();
  }

  private async trackMaxHourlyAverage(): Promise<any> {
    const currentAverage = await this.hourlyAverageService.calculateHourlyAverage();

    // Fetch stored maximum values from Redis
    const storedMax = (await this.redisService.get<{ [key: string]: number }>(this.MAX_KEY)) || {
      maxTemperatureAvg: 0,
      maxHumidityAvg: 0,
      maxProductCountAvg: 0,
    };

    // Compare and update maximum values
    const updatedMax = {
      maxTemperatureAvg: Math.max(storedMax.maxTemperatureAvg, currentAverage.temperatureAvg || 0),
      maxHumidityAvg: Math.max(storedMax.maxHumidityAvg, currentAverage.humidityAvg || 0),
      maxProductCountAvg: Math.max(storedMax.maxProductCountAvg, currentAverage.productCountAvg || 0),
    };

    // Store the updated maximums back to Redis
    await this.redisService.set(this.MAX_KEY, updatedMax);

    // Return updated maximums for the dashboard
    return updatedMax;
  }

  private async calculateMaxFromRedis(oneHourAgo: number, now: number): Promise<any> {
    // Fetch keys for the last hour
    const temperatureKeys = await this.redisService.keys('temperature:*');
    const humidityKeys = await this.redisService.keys('humidity:*');
    const productCountKeys = await this.redisService.keys('product-count:*');

    // Filter keys within the last hour
    const temperatureValues = await this.getValuesWithinTimeRange(temperatureKeys, oneHourAgo, now, 'temperature');
    const humidityValues = await this.getValuesWithinTimeRange(humidityKeys, oneHourAgo, now, 'humidity');
    const productCountValues = await this.getValuesWithinTimeRange(productCountKeys, oneHourAgo, now, 'productCount');

    // Calculate the maximum values
    const maxTemperatureAvg = Math.max(...temperatureValues, 0);
    const maxHumidityAvg = Math.max(...humidityValues, 0);
    const maxProductCountAvg = Math.max(...productCountValues, 0);

    // Return the maximums directly
    return {
      maxTemperatureAvg,
      maxHumidityAvg,
      maxProductCountAvg,
    };
  }

  private async getValuesWithinTimeRange(
    keys: string[],
    startTime: number,
    endTime: number,
    field: string,
  ): Promise<number[]> {
    const relevantKeys = keys.filter((key) => {
      const timestamp = parseInt(key.split(':')[1], 10);
      return !isNaN(timestamp) && timestamp >= startTime && timestamp <= endTime;
    });

    const values = await Promise.all(
      relevantKeys.map((key) => this.redisService.get(key)),
    );

    return values
      .filter((value) => value !== null)
      .map((value) => value[field] || 0);
  }

  private async getFirstDataTimestamp(): Promise<number | null> {
    const keys = await this.redisService.keys('temperature:*');
    if (keys.length === 0) return null;

    const timestamps = keys.map((key) => parseInt(key.split(':')[1], 10));
    return Math.min(...timestamps);
  }
}

