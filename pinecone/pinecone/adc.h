#ifndef ADC_SENSOR_H
#define ADC_SENSOR_H

#include <stdint.h>
#include <stdio.h>
#include <bl602_adc.h>  // For BL602 ADC Standard Driver
#include <bl_adc.h>     // For BL602 ADC Hardware Abstraction Layer
#include <bl_dma.h>     // For BL602 DMA Hardware Abstraction Layer
#include <FreeRTOS.h>  // For FreeRTOS
#include <task.h>      // For vTaskDelay

#define ADC_GPIO 11
#define ADC_FREQUENCY 10000
#define ADC_SAMPLES 1000
#define ADC_GAIN1 ADC_PGA_GAIN_1
#define ADC_GAIN2 ADC_PGA_GAIN_1

// Function declarations
void init_adc(void);
uint32_t read_adc(void);
int set_adc_gain(uint32_t gain1, uint32_t gain2);

#endif // ADC_SENSOR_H
