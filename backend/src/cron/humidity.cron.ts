import { Injectable } from "@nestjs/common";
import { Cron } from '@nestjs/schedule';
import { KafkaProducerService } from "../kafka/producer/kafka.producer.service"; 

@Injectable()
export class HumidityCron{
  constructor(private readonly kafkaProducer: KafkaProducerService){}

  // generating random humidity value every 1s
  @Cron('* * * * * *')
  async handleHumidity(){
    const humidity = Math.random().toFixed(2);
    await this.kafkaProducer.produce('sensor-data', 'humidity', {humidity});
  }
}
