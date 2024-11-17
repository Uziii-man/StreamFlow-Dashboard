import { Controller, Get } from '@nestjs/common';
import { CurrentService } from './current.service';
import { HourlyAverageService } from './hourly-average.service';
import { MaxAverageService } from './max-average.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly currentService: CurrentService,
    private readonly hourlyAverageService: HourlyAverageService,
    private readonly maxAverageService: MaxAverageService,
  ) {}

  @Get('current')
  async getCurrentData() {
    return this.currentService.getCurrentData();
  }

  @Get('average')
  async getHourlyAverage() {
    return this.hourlyAverageService.calculateHourlyAverage();
  }

  @Get('max-average')
  async getMaxHourlyAverage() {
    return this.maxAverageService.getMaxHourlyAverage();
  }
}
