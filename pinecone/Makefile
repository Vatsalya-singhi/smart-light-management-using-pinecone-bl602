#
# This is a project Makefile. It is assumed the directory this Makefile resides in is a
# project subdirectory.
#

PROJECT_NAME := pinecone
PROJECT_PATH := $(abspath .)
PROJECT_BOARD := evb
export PROJECT_PATH PROJECT_BOARD
#CONFIG_TOOLPREFIX :=


ifeq ($(origin BL60X_SDK_PATH), undefined)
BL60X_SDK_PATH_GUESS ?= $(shell pwd)
BL60X_SDK_PATH ?= $(BL60X_SDK_PATH_GUESS)/../..
$(info ****** Please SET BL60X_SDK_PATH ******)
$(info ****** Trying SDK PATH [$(BL60X_SDK_PATH)])
endif

-include ./proj_config.mk

# Add Paho MQTT library source files to the list of sources
#PAHO_MQTT_SOURCES := $(shell find ./pinecone/mqtt -name '*.c')

#SOURCES += $(PAHO_MQTT_SOURCES)

# Path to the Paho MQTT library (adjust as needed)
#PAHO_MQTT_PATH := ./pinecone/mqtt

# Include the Paho MQTT library header files
#INCLUDES += -I$(PAHO_MQTT_PATH)

# NimBLE Porting Layer needed for mulitasking functions
COMPONENTS_NPL     := nimble-porting-layer
#COMPONENTS_NETWORK := sntp dns_server
COMPONENTS_BLSYS   := bltime blfdt blmtd bloop loopadc looprt loopset # blota loopalarm
COMPONENTS_VFS     := romfs # atcmd cjson
#COMPONENTS_BLE     := blecontroller blestack blemesh



INCLUDE_COMPONENTS += freertos_riscv_ram bl602 bl602_std hal_drv vfs yloop utils cli blog blog_testc
INCLUDE_COMPONENTS += easyflash4 # lwip_altcp_tls_mbedtls
#INCLUDE_COMPONENTS += bl602_wifi bl602_wifidrv lwip lwip_dhcpd mbedtls aws-iot httpc netutils blsync_ble cjson audio_device audio_framework
INCLUDE_COMPONENTS += $(COMPONENTS_NETWORK)
INCLUDE_COMPONENTS += $(COMPONENTS_BLSYS)
INCLUDE_COMPONENTS += $(COMPONENTS_VFS)
INCLUDE_COMPONENTS += $(COMPONENTS_NPL)
INCLUDE_COMPONENTS += $(PROJECT_NAME)

include $(BL60X_SDK_PATH)/make_scripts_riscv/project.mk
