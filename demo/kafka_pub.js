const { Kafka, Partitioners } = require('kafkajs');

// Kafka broker
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['your_kafka_broker:9092'] // Replace with your Kafka broker address
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
        message: message,
    });

    await producer.disconnect();
};

module.exports = {
    produceKafkaMessage
};
