// https://docs.nestjs.com/techniques/task-scheduling
import { Injectable } from "@nestjs/common";
import { Interval } from '@nestjs/schedule';
import { KafkaProducerService } from "../kafka/producer/kafka.producer.service"; 

@Injectable()
export class TemperatureCron{
  constructor(private readonly kafkaProducer: KafkaProducerService){}

  // generating random temperature between 20 to 30 every 0.5s
  // https://dev.to/darkmavis1980/random-numbers-in-node-js-with-crypto-4agg#:~:text=random()%20%2C%20which%20it%20will,random()%20*%2010)%3B
  @Interval(500)
  async handleTemperature(){
    const temperature = (Math.random() * 10 + 20).toFixed(2);
    await this.kafkaProducer.produce('sensor-data', 'temperature', {temperature});
  }
}
