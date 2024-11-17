import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ProducerService } from 'src/kafka/producer/producer.service';

@Injectable()
export class TemperatureService {
    constructor(private readonly kafkaProducer: ProducerService) {}

    @Interval(500) 
    async generateTemperature() {
        const temperature = parseFloat((Math.random() * 10 + 20).toFixed(2));
        await this.kafkaProducer.produce('sensor-data', 'temperature', { temperature });
        // console.log('Temperature sent:', temperature)       
    }
}
