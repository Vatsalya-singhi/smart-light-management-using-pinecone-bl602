const mqtt = require('mqtt');

// MQTT broker
const broker = 'mqtt://test.mosquitto.org:1883';
const topic = 'bcefece7-4451-409d-93b9-5f07892e805f'; // Change 'your/topic' to the desired topic

// Create a client instance
const client = mqtt.connect(broker);

// Data to be published
const data = {
    message: 'Hello, MQTT!',
    value: new Date().toLocaleTimeString(),
    // Add more fields as needed
};

// Function to publish data
const publishData = () => {
    const jsonMessage = JSON.stringify(data);
    client.publish(topic, jsonMessage, (err) => {
        if (err) {
            console.error('Error occurred:', err);
        } else {
            console.log('Published:', jsonMessage);
        }
    });
}

// When the client is connected
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Publish data every 10 seconds
    setInterval(publishData, 10000);
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