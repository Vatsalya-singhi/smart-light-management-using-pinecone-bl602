# Makefile for Pinecone BL602 Hello World

PROJECT_NAME := hello_world

# BL602 SDK directory
BL602_SDK_DIR := /path/to/your/bl602_sdk

# BL602 build tools
BL60X_TOOLCHAIN_PATH := $(BL602_SDK_DIR)/toolchain/install

# Compile flags
CFLAGS := -I$(BL602_SDK_DIR)/components/cmsis/include -I$(BL602_SDK_DIR)/components/hal/include -I$(BL602_SDK_DIR)/components/newlib/newlib/libc/include -I$(BL602_SDK_DIR)/components/ble_stack/include -std=c99

# Source files
SRCS := hello.c

OBJS := $(SRCS:.c=.o)

.PHONY: all clean

all: $(PROJECT_NAME).bin

$(PROJECT_NAME).bin: $(OBJS)
    $(BL60X_TOOLCHAIN_PATH)/bin/riscv64-unknown-elf-gcc -o $@ $^ -Wl,-T$(BL602_SDK_DIR)/project/brs/bsp/linker_blsp_5320.lds -nostartfiles -Wl,--gc-sections -Wl,-Map=$(PROJECT_NAME).map -march=rv32imac -mabi=ilp32

clean:
    rm -f $(OBJS) $(PROJECT_NAME).bin $(PROJECT_NAME).map

%.o: %.c
    $(BL60X_TOOLCHAIN_PATH)/bin/riscv64-unknown-elf-gcc $(CFLAGS) -c $< -o $@

.PHONY: clean
