const mqtt = require('mqtt');
require('dotenv').config();

// MQTT broker
const broker = process.env.MQTT_BROKER;
const topic = process.env.MQTT_TOPIC;

// Create a client instance
const client = mqtt.connect(broker);

// Data to be published
const data = {
    message: 'Hello world!',
    value: new Date().toLocaleTimeString(),
    payload: {
        "place_id": "living_room",
        "device_id": 12233,
        "light_status": "true",
        "light_brightness": 0.2,
        "timestamp": "timestamp",
        "sensor": {
            "temprature": 1,
            "PIR": "PIR_VALUE",
            "Light_sensor": 3
        }
    }
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
    const timer = process.env.MQTT_PUB_INTERVAL ?? 10000;
    setInterval(publishData, timer);
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