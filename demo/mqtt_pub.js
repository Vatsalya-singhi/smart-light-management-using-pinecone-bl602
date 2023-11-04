const mqtt = require('mqtt');
const ULID = require('ulid')
require('dotenv').config();

// MQTT broker
const mqtt_broker = process.env.MQTT_BROKER;
const mqtt_topic = process.env.MQTT_TOPIC;
const mqtt_pub_interval = process.env.MQTT_PUB_INTERVAL;
// device specific details
const device_name = process.env.DEVICE_NAME;
const device_id = process.env.DEVICE_ID;
const place_id = process.env.PLACE_ID;

// Create a client instance
const client = mqtt.connect(mqtt_broker);

const getRandomNumber = (min, max, floorFlag = true) => {
    if (floorFlag) {
        return Math.floor(Math.random() * (max - min) + min);
    } else {
        return Math.random() * (max - min) + min;
    }
}

// Data to be published
const payload = {
    "id": ULID.ulid(),
    "name": device_name,
    "device_id": device_id,
    "place_id": place_id,
    "date": new Date().toDateString(),
    "timestamp": new Date().getTime(),
    "payload": {
        "temperature_sensor_readings": getRandomNumber(-10, 30, true),
        "led_status_readings": getRandomNumber(-10, 10, true) > 0 ? true : false,
        "light_brightness_readings": getRandomNumber(0, 1, false).toFixed(2),
        "pir_sensor_readings": getRandomNumber(25, 2000, true),
        "luminosity_sensor_readings": getRandomNumber(0, 1023, true),
    }
}

// Function to publish data
const publishData = () => {
    const jsonMessage = JSON.stringify(payload);
    client.publish(mqtt_topic, jsonMessage, (err) => {
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
    // Publish data every set interval
    setInterval(publishData, mqtt_pub_interval);
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