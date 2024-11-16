import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProducerService } from 'src/kafka/producer/producer.service';

@Injectable()
export class ProductCountService {
  constructor(private readonly kafkaProducer: ProducerService) {}

  @Cron('*/5 * * * * *')
  async generateProductCount() {
    const productCount = Math.floor(Math.random() * 100);
    await this.kafkaProducer.produce('sensor-data', 'product-count', { productCount });
    console.log('Product Count sent:', productCount);
  }
}