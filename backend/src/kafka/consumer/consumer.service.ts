import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from 'kafkajs';


@Injectable()
export class ConsumerService implements OnModuleInit, OnApplicationShutdown {

    private readonly kafka = new Kafka({
        clientId: 'nestjs-consumer', // Add a client ID for better monitoring/logging
        // brokers: [process.env.KAFKA_BROKER || 'localhost:9092'], // use environment variable or fallback to localhost

        brokers: ['localhost:9092'], // use environment variable or fallback to localhost

        retry: {
          retries: 5, // Configure retry options for consumer connection
          initialRetryTime: 300, // Retry interval in ms
        },
      });

    private readonly consumers: Consumer[] = [];

    async onModuleInit() {
        console.log('\nConsumerService initialized');
    }

    async consumer(
        groupId:string, 
        topic:ConsumerSubscribeTopics,
        config: ConsumerRunConfig,
    ){
        const consumer: Consumer = this.kafka.consumer({groupId: groupId});
        try{
            // Connect the consumer
            await consumer.connect();
            console.log(`Consumer connected to group "${groupId}"`);
      
            // Subscribe to the specified topic(s)
            await consumer.subscribe(topic);
            console.log(`Consumer subscribed to topic(s): ${JSON.stringify(topic.topics)}`);
      
            // Start consuming messages
            await consumer.run(config);
            console.log(`Consumer is running for group "${groupId}"`);
      
            // Store the consumer instance for later cleanup
            this.consumers.push(consumer);
        } catch (error) {
            console.error(`Error in Kafka consumer (group: "${groupId}"):`, error.message);
            await consumer.disconnect(); // Ensure clean disconnection on error
        }
    }

    async onApplicationShutdown() {
        for (const consumer of this.consumers){
            await consumer.disconnect();
            console.log('Kafka Consumer disconnected');
        }
    }
}



