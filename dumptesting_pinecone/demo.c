#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <math.h>
#include <stdint.h>
#include <unistd.h>
#include "bl602.h" // Import BL602 SDK headers
#include "bl602_i2c.h"

#include "MQTTClient.h"
#include "transport.h"

// solution 2 headers
#include "bl602_gpio.h"
#include "bl602_i2c.h"
#include "bl602_uart.h"
#include "bl602_tim.h"
// solution 2 headers

#define I2C_BUS 0
#define TSL2561_ADDR 0x39

// TSL2561 command register values
#define TSL2561_CMD_POWERON 0x03
#define TSL2561_CMD_ADCREAD 0x00

// MQTT broker settings
#define MQTT_BROKER_ADDRESS "your_raspberry_pi_ip"
#define MQTT_PORT 8883
#define MQTT_TOPIC "your_topic"
#define MQTT_CLIENT_ID "your_client_id"
#define MQTT_USERNAME "your_username"
#define MQTT_PASSWORD "your_password"

// TLS certificate files
#define MQTT_CA_CERT "path/to/your/server.crt"
#define MQTT_CLIENT_CERT "path/to/your/client.crt"
#define MQTT_CLIENT_KEY "path/to/your/client.key"

/**
 * POSSIBLE SOLUTION 1
 */

void possible_solution_1()
{
    while (1)
    {
        readTSL2561Sensor();
        // Implement your desired delay here if needed
        sleep(10);
    }
}
// Function to read visible and infrared data from TSL2561 sensor
void readTSL2561Sensor()
{
    // Initialize I2C
    I2C_Config_Type config;
    I2C_MasterInit(I2C_BUS, &config);

    // Power on the TSL2561 sensor
    I2C_MasterWrite(I2C_BUS, TSL2561_ADDR, &TSL2561_CMD_POWERON, 1);

    // Wait for sensor measurement (adjust the delay as needed)
    sleep(1);

    // Read sensor data
    uint8_t command = TSL2561_CMD_ADCREAD;
    uint16_t data[2] = {0};

    I2C_MasterWrite(I2C_BUS, TSL2561_ADDR, &command, 1);
    I2C_MasterRead(I2C_BUS, TSL2561_ADDR, data, 4);

    // Calculate the sensor readings
    uint16_t visible = (data[1] << 8) | data[0];
    uint16_t infrared = (data[3] << 8) | data[2];

    // Print sensor readings
    printf("Visible Light: %d\n", visible);
    printf("Infrared Light: %d\n", infrared);

    // convert values as csv
    char buffer[50]; // Make sure the buffer is large enough to hold the resulting string.
    // Use sprintf to format the string with a comma separator
    sprintf(buffer, "%u,%u", visible, infrared);
    // publish reading
    publishTSL2561Sensor(buffer);

    // Power down the TSL2561 sensor
    I2C_MasterWrite(I2C_BUS, TSL2561_ADDR, &TSL2561_CMD_POWERON, 1);

    // Deinitialize I2C
    I2C_Deinit(I2C_BUS);
}

/**
 * POSSIBLE SOLUTION 2
 */

// another possible solution
void posssible_solution_2()
{
    while (1)
    {
        initializeI2C();
        tsl2561_read_lux();
        // Implement your desired delay here if needed
        sleep(10);
    }
}
// Function to read lux data from TSL2561 sensor
void tsl2561_read_lux()
{
    // Initialize the I2C hardware on the BL602 board
    bl_i2c_init(0);          // Use I2C channel 0
    bl_i2c_enable(0);        // Enable the I2C channel
    bl_i2c_speed(0, 100000); // Set I2C speed to 100 kHz (adjust as needed)

    uint8_t command = 0x80; // Command to read data
    bl_i2c_transmit(0, TSL2561_I2C_ADDR, &command, 1);

    // Read the lux values (typically 2 bytes)
    uint8_t lux_data[2];
    bl_i2c_receive(0, TSL2561_I2C_ADDR, lux_data, 2);

    // Combine the two bytes to get lux value
    uint16_t lux = (lux_data[1] << 8) | lux_data[0];

    // convert values as csv
    char buffer[50]; // Make sure the buffer is large enough to hold the resulting string.
    // Use sprintf to format the string with a comma separator
    sprintf(buffer, "%u,0", lux);
    // publish reading
    publishTSL2561Sensor(buffer);
}

/**
 * COMMON FUNCTIONS
 */

// publish buffer value to raspberry pi
void publishTSL2561Sensor(char buffer)
{
    // Connect to the MQTT broker
    Network n;
    MQTTClient client;
    NetworkInit(&n);
    MQTTClientInit(&client, &n, 3000, buf, 3000, publishTSL2561Sensor);

    MQTTPacket_connectData data = MQTTPacket_connectData_initializer;
    data.willFlag = 0;

    // Set up TLS options
    MQTTClient_SSLOptions ssl_opts = MQTTClient_SSLOptions_initializer;
    ssl_opts.trustStore = MQTT_CA_CERT;
    ssl_opts.keyStore = MQTT_CLIENT_CERT;
    ssl_opts.privateKey = MQTT_CLIENT_KEY;

    // Connect to the broker with TLS encryption
    NetworkConnectSSL(&n, MQTT_BROKER_ADDRESS, MQTT_PORT, ssl_opts);
    MQTTClientConnect(&client, &data);

    // Publish sensor data
    MQTTClient_message pubmsg = MQTTClient_message_initializer;

    pubmsg.payload = buffer; // "Sensor Data"
    pubmsg.payloadlen = strlen(pubmsg.payload);
    pubmsg.qos = QOS0;
    pubmsg.retained = 0;
    MQTTClient_publish(&client, MQTT_TOPIC, &pubmsg);

    // Disconnect from the broker
    MQTTClient_disconnect(&client);
    NetworkDisconnect(&n);
}

int main()
{
    bool try_solution_1 = true;
    if (try_solution_1)
    {
        possible_solution_1();
    }
    else
    {
        posssible_solution_2();
    }
    return 0;
}

// doc reffered
// https://cdn-shop.adafruit.com/datasheets/TSL2561.pdf (ctrl+f -> APPLICATION INFORMATION: SOFTWARE)