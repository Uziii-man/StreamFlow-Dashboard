import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";

@Injectable()
export class KafkaProducerService{

    private kafka = new Kafka({brokers: ['localhost:9092']});
    private producer = this.kafka.producer();

    // send messages
    async produce(topic: string, key: string, message: object){
        await this.producer.connect();
        await this.producer.send({
            topic,
            messages: [
                {key, value: JSON.stringify(message)}
            ],
        });
        await this.producer.disconnect();
    }
}

