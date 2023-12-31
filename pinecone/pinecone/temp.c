#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <bl_adc.h>    //  For BL602 Internal Temperature Sensor
#include <bl602_adc.h> //  For BL602 ADC Standard Driver
#include <bl602_glb.h> //  For BL602 Global Register Standard Driver
#include <FreeRTOS.h>  //  For FreeRTOS
#include <task.h>      //  For vTaskDelay
#include "temp.h"

/// Read BL602 / BL604's Internal Temperature Sensor as Float
float read_tsen2(void)
{
    //  Temperature in Celsius
    float temp = 0;

    //  Read the Internal Temperature Sensor as Float
    int rc = get_tsen_adc(
        &temp, //  Temperature in Celsius
        1      //  0 to disable logging, 1 to enable logging
    );
    assert(rc == 0);

    //  Show the temperature
    // printf("Returned Temperature = %f Celsius\r\n", temp);
    return temp;
}

/// Read the Internal Temperature Sensor as Float. Returns 0 if successful.
/// Based on bl_tsen_adc_get in https://github.com/lupyuen/bl_iot_sdk/blob/tsen/components/hal_drv/bl602_hal/bl_adc.c#L224-L282
int get_tsen_adc(
    float *temp,     //  Pointer to float to store the temperature
    uint8_t log_flag //  0 to disable logging, 1 to enable logging
)
{
    assert(temp != NULL);
    static uint16_t tsen_offset = 0xFFFF;
    float val = 0.0;

    //  If the offset has not been fetched...
    if (0xFFFF == tsen_offset)
    {
        //  Define the ADC configuration
        tsen_offset = 0;
        ADC_CFG_Type adcCfg = {
            .v18Sel = ADC_V18_SEL_1P82V,                    /*!< ADC 1.8V select */
            .v11Sel = ADC_V11_SEL_1P1V,                     /*!< ADC 1.1V select */
            .clkDiv = ADC_CLK_DIV_32,                       /*!< Clock divider */
            .gain1 = ADC_PGA_GAIN_1,                        /*!< PGA gain 1 */
            .gain2 = ADC_PGA_GAIN_1,                        /*!< PGA gain 2 */
            .chopMode = ADC_CHOP_MOD_AZ_PGA_ON,             /*!< ADC chop mode select */
            .biasSel = ADC_BIAS_SEL_MAIN_BANDGAP,           /*!< ADC current form main bandgap or aon bandgap */
            .vcm = ADC_PGA_VCM_1V,                          /*!< ADC VCM value */
            .vref = ADC_VREF_2V,                            /*!< ADC voltage reference */
            .inputMode = ADC_INPUT_SINGLE_END,              /*!< ADC input signal type */
            .resWidth = ADC_DATA_WIDTH_16_WITH_256_AVERAGE, /*!< ADC resolution and oversample rate */
            .offsetCalibEn = 0,                             /*!< Offset calibration enable */
            .offsetCalibVal = 0,                            /*!< Offset calibration value */
        };
        ADC_FIFO_Cfg_Type adcFifoCfg = {
            .fifoThreshold = ADC_FIFO_THRESHOLD_1,
            .dmaEn = DISABLE,
        };

        //  Enable and reset the ADC
        GLB_Set_ADC_CLK(ENABLE, GLB_ADC_CLK_96M, 7);
        ADC_Disable();
        ADC_Enable();
        ADC_Reset();

        //  Configure the ADC and Internal Temperature Sensor
        ADC_Init(&adcCfg);
        ADC_Channel_Config(ADC_CHAN_TSEN_P, ADC_CHAN_GND, 0);
        ADC_Tsen_Init(ADC_TSEN_MOD_INTERNAL_DIODE);
        ADC_FIFO_Cfg(&adcFifoCfg);

        //  Fetch the offset
        BL_Err_Type rc = ADC_Trim_TSEN(&tsen_offset);
        assert(rc != ERROR); //  Read efuse data failed

        //  Must wait 100 milliseconds or returned temperature will be negative
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
    //  Read the temperature based on the offset
    val = TSEN_Get_Temp(tsen_offset);
    if (log_flag)
    {
        printf("offset = %d\r\n", tsen_offset);
        printf("temperature = %f Celsius\r\n", val);
    }
    //  Return the temperature
    *temp = val;
    return 0;
}