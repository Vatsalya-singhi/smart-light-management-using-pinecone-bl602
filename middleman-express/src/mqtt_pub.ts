// const mqtt = require('mqtt');
// require('dotenv').config();
import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';
dotenv.config();

export class MQTTPublisher {

    // MQTT broker
    public mqtt_broker = process.env.MQTT_BROKER;
    public mqtt_topic = process.env.MQTT_TOPIC;
    // device specific details
    // public device_name = process.env.DEVICE_NAME;
    // public device_id = process.env.DEVICE_ID;
    // public place_id = process.env.PLACE_ID;

    // Create a client instance
    public client: mqtt.MqttClient = mqtt.connect(this.mqtt_broker);

    constructor() {
        this.logger();
    }

    /**
     * PUBLIC FUNCTIONS
    */

    public async publishData() {
        const payload = this.fetch_payload();
        const jsonMessage = JSON.stringify(payload);
        this.client.publish(this.mqtt_topic, jsonMessage, (err) => {
            if (err) {
                console.error('Error occurred:', err);
            } else {
                console.log('Published:', jsonMessage);
            }
        });
    }


    /**
     * HELPER FUNCTIONS
     */

    public getRandomNumber(min: number, max: number, floorFlag: boolean = true) {
        if (floorFlag) {
            return Math.floor(Math.random() * (max - min) + min);
        } else {
            return Math.random() * (max - min) + min;
        }
    }

    // Data to be published
    public fetch_payload() {
        const device_id = this.getRandomNumber(1, 4, true);
        const placeList = ["Kitchen", "Living Room", "Bed Room"];
        const date = new Date();
        return {
            "device_id": device_id,
            "device_name": `iot_sensor_${device_id}`,
            "place_id": placeList[device_id - 1],
            "date": date.toISOString(), // 2023-11-06T19:47:42.440Z
            "timestamp": date.getTime(), // number in ns
            "payload": {
                "temperature_sensor_reading": this.getRandomNumber(-10, 30, true),
                "led_status_reading": this.getRandomNumber(-10, 10, true) > 0 ? true : false,
                "luminosity_reading": Number(this.getRandomNumber(0, 1, false).toFixed(2)),
                "proximity_sensor_reading": this.getRandomNumber(25, 2000, true),
                "light_sensor_reading": this.getRandomNumber(0, 1023, true),
            }
        }
    }

    public logger() {
        // When the client is connected
        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });
        // Handle errors
        this.client.on('error', (error) => {
            console.error('Error:', error);
        });
    }

    // Close the connection on script termination
    public disconnect() {
        // do some stuff here
        this.client.end();
        console.log('Disconnected from MQTT broker');
    }
}