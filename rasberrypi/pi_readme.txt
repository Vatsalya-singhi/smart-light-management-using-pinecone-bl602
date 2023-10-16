## Set Up the MQTT Broker on Raspberry Pi
sudo apt-get install mosquitto mosquitto-clients
sudo systemctl enable mosquitto

## enable and start the Mosquitto service
sudo systemctl start mosquitto

## Generate TLS Certificates
openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 365

## subscribe on Pi
mosquitto_sub -h your_raspberry_pi_ip -p 8883 --cafile path/to/your/server.crt -t your_topic -u your_username -P your_password

## Required Python Libraries
pip install paho-mqtt