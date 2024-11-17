import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class HourlyAverageService {
  constructor(private readonly redisService: RedisService) {}

  async calculateHourlyAverage(): Promise<any> {
    const temperatureAvg = await this.getAverageForKey('temperature:*');
    const humidityAvg = await this.getAverageForKey('humidity:*');
    const productCountAvg = await this.getAverageForKey('product-count:*');

    return {
      temperatureAvg,
      humidityAvg,
      productCountAvg,
    };
  }

  private async getAverageForKey(pattern: string): Promise<number | null> {
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;

    // Fetch all matching keys
    const keys = await this.redisService.keys(pattern);

    // Filter keys within the last hour
    const relevantKeys = keys.filter((key) => {
      const timestamp = parseInt(key.split(':')[1], 10);
      console.log("\nTimestamp: ", timestamp);
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

    // Extract numeric values and calculate average
    const parsedValues = values
      .filter((value) => value !== null)
      .map((value) => value.value);

    if (!parsedValues.length) return 0;

    const sum = parsedValues.reduce((acc, val) => acc + val, 0);
    console.log("\nHourly average: " ,sum, parsedValues.length);
    return sum / parsedValues.length;
  }
}

