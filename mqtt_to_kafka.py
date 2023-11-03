import json
import time
import ssl
import random
import string
from kafka import KafkaProducer
import paho.mqtt.client as mqtt

# pip install paho-mqtt kafka-python


# Set up the Kafka producer
KAFKA_SERVER = 'localhost:9092'  # Use your Kafka broker's address
KAFKA_TOPIC = 'your_kafka_topic'  # Set the Kafka topic you want to produce to
PRODUCER = KafkaProducer(bootstrap_servers=KAFKA_SERVER)

# Set up MQTT parameters
MQTT_SERVER = 'mqtt.eclipse.org'  # Use the MQTT broker's address
MQTT_TOPIC = 'your_mqtt_topic'  # Set the MQTT topic to subscribe to

def on_message(client, userdata, message):
    """Function to recieve MQTT message."""
    payload = message.payload.decode()
    print("Received message:", payload)
    
    # Produce the received message to Kafka
    PRODUCER.send(KAFKA_TOPIC, value=json.dumps(payload).encode('utf-8'))

def on_connect(client, userdata, flags, rc):
    """Function on connect to MQTT broker."""
    print("Connected with result code " + str(rc))
    client.subscribe(MQTT_TOPIC)

def on_disconnect(client, userdata, rc):
    """Function on disconnect from MQTT broker."""
    print("Disconnected with result code " + str(rc))

# MQTT client setup
CLIENT_ID = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
client = mqtt.Client(client_id=CLIENT_ID)
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message
# Optionally, set MQTT username and password if required
client.username_pw_set("your_username", "your_password")

client.connect(MQTT_SERVER, 1883, 60)

# Start the MQTT loop
client.loop_start()

# Keep the script running
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Exiting...")
    client.disconnect()
    client.loop_stop()
    PRODUCER.close()
