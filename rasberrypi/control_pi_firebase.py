import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import paho.mqtt.client as mqtt
import json
from datetime import datetime

# Set up MQTT client
mqtt_client = mqtt.Client()
mqtt_client.connect("your_mqtt_broker", port=1883)
mqtt_client.subscribe("your_topic", qos=0)


# Initialize Firebase with the service account credentials
cred = credentials.Certificate("path/to/your/credentials.json")  # Replace with your credentials file path
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-database-name.firebaseio.com'  # Replace with your database URL
})
# Define the Firebase database reference
ref = db.reference('/')

def send_data_to_firebase(sensor_data):
    # Data to send to Firebase
    payload = {
        'MeasureName': 'sensor_data',
        'MeasureValue': str(sensor_data),
        'Time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    try:
        # Push the data to the Firebase Realtime Database
        new_data_ref = ref.push(payload)
        print("Data pushed to Firebase with key:", new_data_ref.key)
    except Exception as e:
        print("An error occurred:", str(e))
    
# Subscribe callback
def on_message(client, userdata, message):
    payload = message.payload.decode("utf-8")
    print(f"Received message '{payload}' on topic '{message.topic}'")
    # Send the received data to Firebase
    send_data_to_firebase(payload)


mqtt_client.on_message = on_message
# Start MQTT clients
mqtt_client.loop_start()