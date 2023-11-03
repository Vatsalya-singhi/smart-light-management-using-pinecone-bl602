const mqtt = require('mqtt');
const { produceKafkaMessage } = require('./kafka_pub'); // Importing the produceMessage function

// MQTT broker
const broker = 'mqtt://test.mosquitto.org:1883';
const topic = 'bcefece7-4451-409d-93b9-5f07892e805f'; // Replace with the topic you want to subscribe to

// Create a client instance
const client = mqtt.connect(broker);

// When the client is connected
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Subscribe to the specified topic
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log('Subscribed to', topic);
        } else {
            console.error('Subscription error:', err);
        }
    });
});

// When a message is received
client.on('message', (receivedTopic, message) => {
    console.log('Received message on topic:', receivedTopic.toString());
    console.log('Message:', message.toString());


    // Call Kafka's produceMessage function with received MQTT message
    produceKafkaMessage('your_kafka_topic', message.toString())
        .then(() => {
            console.log('Message published to Kafka')
        })
        .catch((error) => {
            console.error('Error publishing message to Kafka:', error)
        });

});

// Handle errors
client.on('error', (error) => {
    console.error('Error:', error);
});

// Close the connection on script termination
const signalHandler = (signal) => {
    // do some stuff here
    client.end();
    console.log('Disconnected from MQTT broker');
    process.exit();
}

process.on('SIGINT', signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)