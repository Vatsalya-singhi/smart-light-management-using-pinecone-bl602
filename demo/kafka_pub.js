const { Kafka, Partitioners } = require('kafkajs');
require('dotenv').config();

// Kafka broker
const kafka = new Kafka({
    clientId: process.env.KAFKA_PUB_CLIENT_ID,
    brokers: ['172.18.240.1:9092'] // Replace with your Kafka broker address
});

// Create a producer
// const producer = kafka.producer();
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

// Function to produce a message
const produceKafkaMessage = async (topic, message) => {
    await producer.connect();

    // Sending a message
    await producer.send({
        topic: topic,
        messages: [
            { value: message },
        ],
    });

    await producer.disconnect();
};

module.exports = {
    produceKafkaMessage
};
