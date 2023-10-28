#ifndef ADC1_H
#define ADC1_H

#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <cli.h>
#include <hal_adc.h>

#define ADC_GPIO 11

void init_adc();
void read_adc();

#endif /* ADC1_H */