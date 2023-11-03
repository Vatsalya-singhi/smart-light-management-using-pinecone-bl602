const { Kafka } = require('kafkajs');
require('dotenv').config();

// Kafka broker
const kafka = new Kafka({
    clientId: process.env.KAFKA_SUB_CLIENT_ID,
    brokers: ['172.18.240.1:9092'] // Replace with your Kafka broker address
});

async function init() {
    const consumer = kafka.consumer({ groupId: 'test-group' })
    await consumer.connect()

    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`[${topic}]: PART:${partition}:`, message.value.toString());
        },
    })

}

init();