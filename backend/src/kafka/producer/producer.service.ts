import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown{

    private readonly kafka = new Kafka({
        clientId: 'nestjs-producer', // Added clientId for better monitoring/logging
        brokers: ['localhost:9092'], 
        retry: {
          retries: 5, // Number of retries for sending messages
          initialRetryTime: 300, // Time in ms before the first retry
        },
    });

    private readonly producer: Producer = this.kafka.producer();

    // to connect
    async onModuleInit() {
        try{
            await this.producer.connect();
            console.log('kafka producer successfully connected');
        }catch (error) {
            console.error('error connecting Kafka producer:', error.message);
            throw error; 
        }
    }

    // send messages
    async produce(topic: string, key: string, message: object): Promise<void> {
        // await this.producer.send({
        const record: ProducerRecord = {
            topic,
            messages: [
                {
                    key, 
                    value: JSON.stringify(message)
                },
            ],
        };

        try{
            await this.producer.send(record);
            console.log(`message sent to topic "${topic}" with key "${key}"`);
        } catch (error) {
            console.error(`error sending message to topic "${topic}":`, error.message);
        }         
    }

    // to disconnect
    async onApplicationShutdown() {
        try{
        await this.producer.disconnect();
        console.log('kafka producer disconnected')
        } catch (error) {
            console.error('error disconnecting kafka producer', error.message)
        }
    }
}

