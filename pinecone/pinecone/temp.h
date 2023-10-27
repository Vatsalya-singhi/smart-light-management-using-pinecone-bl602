#ifndef TEMP_H
#define TEMP_H

#include <stdint.h>
#include <stdio.h>
#include <bl_adc.h>    // For BL602 Internal Temperature Sensor
#include <bl602_adc.h> // For BL602 ADC Standard Driver
#include <bl602_glb.h> // For BL602 Global Register Standard Driver
#include <FreeRTOS.h>  // For FreeRTOS
#include <task.h>      // For vTaskDelay

// Function declarations
float read_tsen2(void);
int get_tsen_adc(float *temp, uint8_t log_flag);

#endif // TEMP_H