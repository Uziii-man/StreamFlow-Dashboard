import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";

@Injectable()
export class KafkaConsumerService{
    private kafka = new Kafka({brokers: ['localhost:9092']});
    private consumer = this.kafka.consumer({groupId: 'sensor-group'})

    async onModuleInit() {
        await this.consumer.connect();
        await this.consumer.subscribe({topic: 'sensor-data', fromBeginning: true});

        this.consumer.run({
            eachMessage: async ({topic, partition, message})=> {
                const key = message.key.toString();
                const value = JSON.parse(message.value.toString());

                if (key === 'temperature'){
                    console.log('Temperature: ', value);
                } else if (key === 'humidity'){
                    console.log('Humidity: ', value);
                } else if (key === 'product-count'){
                    console.log('Humidity: ', value);
                }
            }

        })

    }
    
}

