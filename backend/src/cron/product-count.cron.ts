import { Injectable } from "@nestjs/common";
import { Cron } from '@nestjs/schedule';
import { KafkaProducerService } from "../kafka/producer/kafka.producer.service"; 

@Injectable()
export class ProductCountCron{
  constructor(private readonly kafkaProducer: KafkaProducerService){}

  // generating random product-count value every 15s
  @Cron('* * * * * *')
  async handleProductCount(){
    const productCount = (Math.random()*100);
    await this.kafkaProducer.produce('sensor-data', 'product-count', {productCount});
  }
}
