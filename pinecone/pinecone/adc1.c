//  Measure the ambient brightness with an LED configured as ADC Input.
//  Note: ADC Gain must be set to ADC_PGA_GAIN_1 in components/hal_drv/bl602_hal/bl_adc.c:
//  int bl_adc_init(int mode, int gpio_num) {
//    ...
//    adccfg.gain1=ADC_PGA_GAIN_1;  // Previously: ADC_PGA_GAIN_NONE
//    adccfg.gain2=ADC_PGA_GAIN_1;  // Previously: ADC_PGA_GAIN_NONE
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <cli.h>
#include <hal_adc.h> //  For BL602 ADC Hardware Abstraction Layer
#include "adc1.h"

/// GPIO Pin Number that will be configured as ADC Input.
/// PineCone Blue LED is connected on BL602 GPIO 11.
/// PineCone Green LED is connected on BL602 GPIO 14.
/// Only these GPIOs are supported: 4, 5, 6, 9, 10, 11, 12, 13, 14, 15
/// TODO: Change the GPIO Pin Number for your BL602 board
#define ADC_GPIO 11

/// Init the ADC Channel
void init_adc()
{
    //  Only these GPIOs are supported: 4, 5, 6, 9, 10, 11, 12, 13, 14, 15
    assert(ADC_GPIO == 4 || ADC_GPIO == 5 || ADC_GPIO == 6 || ADC_GPIO == 9 || ADC_GPIO == 10 || ADC_GPIO == 11 || ADC_GPIO == 12 || ADC_GPIO == 13 || ADC_GPIO == 14 || ADC_GPIO == 15);

    //  We set the ADC Frequency to 10 kHz according to https://wiki.analog.com/university/courses/electronics/electronics-lab-led-sensor?rev=1551786227
    //  This is 10,000 samples per second.
    //  We shall read 1000 samples, which will take 0.1 seconds.
    int rc = hal_adc_init(
        1,       //  Single-Channel Conversion Mode
        10000,   //  Frequency
        1000,    //  Number of Samples
        ADC_GPIO //  GPIO Pin Number
    );
    assert(rc == 0);
}

/// Read the ADC Channel
void read_adc()
{
    //  Read the ADC Channel via DMA. Returns -1 in case of error.
    int val = hal_adc_get_data(
        ADC_GPIO, //  GPIO Pin Number
        1         //  Raw Flag
    );
    //  Raw Flag = 0: Returns raw value between 0 to 65535
    //  Raw Flag = 1: Returns scaled value between 0 to 3199
    printf("adc value=%d\r\n", val);
}
