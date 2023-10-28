/*
 * Copyright (c) 2020 Bouffalolab.
 *
 * This file is part of
 *     *** Bouffalolab Software Dev Kit ***
 *      (see www.bouffalolab.com).
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *   1. Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *   2. Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *   3. Neither the name of Bouffalo Lab nor the names of its contributors
 *      may be used to endorse or promote products derived from this software
 *      without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <FreeRTOS.h>
#include <task.h>
#include <bl_uart.h>
#include <temp.h>

#include <timers.h>
#include <vfs.h>
#include <aos/kernel.h>
#include <aos/yloop.h>
#include <event_device.h>
#include <bl_uart.h>
#include <bl_chip.h>
#include <bl_sec.h>
#include <bl_cks.h>
#include <bl_irq.h>
#include <bl_dma.h>
#include <hal_uart.h>
#include <hal_sys.h>
#include <hal_boot2.h>
#include <hal_board.h>
#include <bl_sys_time.h>
#include <fdt.h>
#include <libfdt.h>
#include <blog.h>
#include <looprt.h>
#include <loopset.h>
#include <adc.h>
// #include <adc1.h>

void user_vApplicationStackOverflowHook(TaskHandle_t xTask, char *pcTaskName)
{
    /*empty*/
}

void vApplicationStackOverflowHook(TaskHandle_t xTask, char *pcTaskName)
{
    /*empty*/
}

void user_vApplicationMallocFailedHook(void)
{
    printf("Malloc failed! Handle the situation here.\n");
    // printf("Memory Allocate Failed. Current left size is %d bytes\r\n",
    //        xPortGetFreeHeapSize());
    /*empty*/
}

void vApplicationMallocFailedHook(void)
{
    printf("Malloc failed! Handle the situation here.\n");
    // printf("Memory Allocate Failed. Current left size is %d bytes\r\n",
    //        xPortGetFreeHeapSize());
    /*empty*/
}

void user_vApplicationIdleHook(void)
{
    __asm volatile(
        "   wfi     ");
    /*empty*/
}

void vApplicationIdleHook(void)
{
    __asm volatile(
        "   wfi     ");
    /*empty*/
}

void vApplicationGetIdleTaskMemory(StaticTask_t **ppxIdleTaskTCBBuffer, StackType_t **ppxIdleTaskStackBuffer, uint32_t *pulIdleTaskStackSize)
{
    /* If the buffers to be provided to the Idle task are declared inside this
    function then they must be declared static - otherwise they will be allocated on
    the stack and so not exists after this function exits. */
    static StaticTask_t xIdleTaskTCB;
    static StackType_t uxIdleTaskStack[configMINIMAL_STACK_SIZE];

    /* Pass out a pointer to the StaticTask_t structure in which the Idle task's
    state will be stored. */
    *ppxIdleTaskTCBBuffer = &xIdleTaskTCB;

    /* Pass out the array that will be used as the Idle task's stack. */
    *ppxIdleTaskStackBuffer = uxIdleTaskStack;

    /* Pass out the size of the array pointed to by *ppxIdleTaskStackBuffer.
    Note that, as the array is necessarily of type StackType_t,
    configMINIMAL_STACK_SIZE is specified in words, not bytes. */
    *pulIdleTaskStackSize = configMINIMAL_STACK_SIZE;
}

/* configSUPPORT_STATIC_ALLOCATION and configUSE_TIMERS are both set to 1, so the
application must provide an implementation of vApplicationGetTimerTaskMemory()
to provide the memory that is used by the Timer service task. */
void vApplicationGetTimerTaskMemory(StaticTask_t **ppxTimerTaskTCBBuffer, StackType_t **ppxTimerTaskStackBuffer, uint32_t *pulTimerTaskStackSize)
{
    /* If the buffers to be provided to the Timer task are declared inside this
    function then they must be declared static - otherwise they will be allocated on
    the stack and so not exists after this function exits. */
    static StaticTask_t xTimerTaskTCB;
    static StackType_t uxTimerTaskStack[configTIMER_TASK_STACK_DEPTH];

    /* Pass out a pointer to the StaticTask_t structure in which the Timer
    task's state will be stored. */
    *ppxTimerTaskTCBBuffer = &xTimerTaskTCB;

    /* Pass out the array that will be used as the Timer task's stack. */
    *ppxTimerTaskStackBuffer = uxTimerTaskStack;

    /* Pass out the size of the array pointed to by *ppxTimerTaskStackBuffer.
    Note that, as the array is necessarily of type StackType_t,
    configTIMER_TASK_STACK_DEPTH is specified in words, not bytes. */
    *pulTimerTaskStackSize = configTIMER_TASK_STACK_DEPTH;
}

void vAssertCalled(void)
{
    volatile uint32_t ulSetTo1ToExitFunction = 0;

    taskDISABLE_INTERRUPTS();
    while (ulSetTo1ToExitFunction != 1)
    {
        __asm volatile("NOP");
    }
}

static void system_init(void)
{
    blog_init();
    bl_irq_init();
    bl_sec_init();
    bl_sec_test();
    bl_dma_init();
    hal_boot2_init();
    /* board config is set after system is init*/
    hal_board_cfg(0);
}

static void system_thread_init()
{
    /*nothing here*/
}

// Custom delay function to approximate a 10-second delay
void custom_delay()
{
    for (volatile int i = 0; i < 5000000; ++i)
    {
        for (volatile int j = 0; j < 2; ++j)
        {
            // This loop simulates a delay by executing instructions
            // Adjust the loop count based on the system speed to approximate the delay
        }
    }
}

void bfl_main(void)
{
    /*
     * Init UART using pins 16+7 (TX+RX)
     * and baudrate of 2M
     */
    bl_uart_init(0, 16, 7, 255, 255, 2 * 1000 * 1000);
    // adc light sensor setup
    // system_init();
    // system_thread_init();
    // init_adc();

    while (1)
    {
        // temperature sensor
        float temperature = read_tsen2();
        printf("Returned Temperature = %f Celsius\r\n", temperature);

        // adc light sensor
        // read_adc();
        // uint32_t adcValue = read_adc();
        // printf("Average value of the ADC Samples = %lu\r\n", adcValue);

        // Use the custom delay function for a 10-second pause
        custom_delay();
    }
}

