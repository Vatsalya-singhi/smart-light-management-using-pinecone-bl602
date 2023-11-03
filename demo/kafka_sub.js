const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka_sub_client_id = process.env.KAFKA_SUB_CLIENT_ID;
const kafka_broker = process.env.KAFKA_BROKER;
const kafka_topic = process.env.KAFKA_TOPIC;

// Kafka broker
const kafka = new Kafka({
    clientId: kafka_sub_client_id,
    brokers: [kafka_broker] // Replace with your Kafka broker address
});

async function init() {
    const consumer = kafka.consumer({ groupId: 'test-group' })
    await consumer.connect()

    await consumer.subscribe({ topic: kafka_topic, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`[${topic}]: PART:${partition}:`, message.value.toString());
        },
    })

}

init();