import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProducerService } from 'src/kafka/producer/producer.service';

@Injectable()
export class HumidityService {
  constructor(private readonly kafkaProducer: ProducerService) {}

  @Cron('* * * * * *')
  async generateHumidity() {
    const humidity = (Math.random() * 100).toFixed(2);
    await this.kafkaProducer.produce('sensor-data', 'humidity', { humidity });
    console.log('Humidity sent:', humidity);
  }
}
