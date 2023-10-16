# IoT Project README

## Overview

This IoT project demonstrates the flow of sensor data from a Pinecone BL602 device to Amazon Timestream, facilitated by a Raspberry Pi acting as an intermediate gateway. Additionally, it showcases the ability to trigger an actuator connected to the Pinecone BL602 device through AWS Lambda.

## Project Components

- **Pinecone BL602:** A microcontroller device equipped with sensors and an actuator.
- **Raspberry Pi:** An intermediary device responsible for bridging communication between Pinecone BL602 and AWS.
- **Amazon Web Services (AWS):** Cloud services used for data storage, processing, and management.
  - **AWS IoT Core:** Manages IoT devices and MQTT messaging.
  - **AWS Lambda:** Executes code based on events.
  - **Amazon Timestream:** A time-series database for storing sensor data.
  
## Project Flow

1. The Pinecone BL602 device collects sensor data and publishes it to an MQTT topic.
2. The Raspberry Pi subscribes to the MQTT topic, receives the sensor data, and passes it to AWS.
3. The sensor data is stored in Amazon Timestream for analysis and visualization.
4. An AWS Lambda function is triggered, which sends an MQTT control message to the Raspberry Pi.
5. The Raspberry Pi, upon receiving the control message, interprets it and triggers an actuator on the Pinecone BL602 device.

## Project Setup

1. **Pinecone BL602:**
   - Implement code to collect sensor data and publish it to an MQTT topic.
   - Set up MQTT client for receiving actuator control commands.

2. **Raspberry Pi:**
   - Subscribe to the MQTT topic for receiving sensor data from Pinecone BL602.
   - Publish MQTT messages to control the Pinecone BL602 actuator.

3. **Amazon Web Services:**
   - Set up an AWS IoT Thing for the Pinecone BL602.
   - Configure an IoT policy for the Thing.
   - Create an IoT rule to trigger the AWS Lambda function.
   - Set up an AWS Lambda function for actuator control.
   - Create an Amazon Timestream database and table for storing sensor data.
   - Configure AWS credentials and permissions for Lambda and IoT Core.

## Usage

- Start your Pinecone BL602 device and ensure it's connected to the MQTT broker.
- Run the Raspberry Pi script to subscribe to the MQTT topic.
- Send actuator control commands from the AWS Lambda function to trigger actions on the Pinecone BL602.

## Troubleshooting

- Ensure that your hardware is properly connected and configured.
- Check AWS credentials, policy, and rule configurations.
- Verify that the MQTT broker and Timestream are accessible and correctly configured.

## Security

- Secure your MQTT communication with encryption and authentication.
- Ensure that AWS credentials are well-protected and not exposed in your code.

## Contributing

Contributions to this project are welcome. If you have ideas for improvements or bug fixes, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to modify this README file to include specific details about your project, including hardware specifications, software setup, and other relevant information. Additionally, you can include a license file (e.g., MIT License) to specify how your project can be used and shared.
