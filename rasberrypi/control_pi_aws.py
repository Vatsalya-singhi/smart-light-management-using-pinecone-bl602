import AWSIoTPythonSDK.MQTTLib as AWSIoTMQTTClient
import paho.mqtt.client as mqtt
import json
import boto3
from datetime import datetime

# Set up MQTT client
mqtt_client = mqtt.Client()
mqtt_client.connect("your_mqtt_broker", port=1883)
mqtt_client.subscribe("your_topic", qos=0)

# AWS IoT Core configuration
aws_host = "your_iot_host.iot.us-east-1.amazonaws.com"
root_ca_path = "path/to/AmazonRootCA1.pem"
certificate_path = "path/to/your_certificate.pem.crt"
private_key_path = "path/to/your_private.pem.key"
iot_client_id = "your_iot_client_id"

# Set up AWS IoT MQTT client
aws_client = AWSIoTMQTTClient.AWSIoTMQTTClient(iot_client_id)
aws_client.configureEndpoint(aws_host, 8883)
aws_client.configureCredentials(root_ca_path, private_key_path, certificate_path)
aws_client.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queue
aws_client.configureDrainingFrequency(2)  # Draining: 2 Hz
aws_client.configureConnectDisconnectTimeout(10)  # 10 sec
aws_client.configureMQTTOperationTimeout(5)  # 5 sec


def send_data_to_timestream(sensor_data):
    timestream = boto3.client('timestream-write')
    # Assuming you have set up a database and table in Timestream
    database_name = 'your_database'
    table_name = 'your_table'
    records = [
        {
            'MeasureName': 'sensor_data',
            'MeasureValue': str(sensor_data),
            'Time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    ]
    response = timestream.write_records(
        DatabaseName=database_name,
        TableName=table_name,
        Records=records
    )
    print(f"Data sent to Timestream: {response}")
    
# Subscribe callback
def on_message(client, userdata, message):
    payload = message.payload.decode("utf-8")
    print(f"Received message '{payload}' on topic '{message.topic}'")
    # Send the received data to Amazon Timestream
    send_data_to_timestream(payload)

mqtt_client.on_message = on_message

# Start MQTT clients
mqtt_client.loop_start()
aws_client.connect()

# AWS IoT Core MQTT loop
aws_client.subscribe("your_topic", 1, on_message)
aws_client.loop_forever()
