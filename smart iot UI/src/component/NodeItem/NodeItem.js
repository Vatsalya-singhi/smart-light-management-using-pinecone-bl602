/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from "@mui/material/styles";

import LightIcon from "@mui/icons-material/Light";
import TungstenIcon from "@mui/icons-material/Tungsten";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useNavigate, useSearchParams } from "react-router-dom";

import MQTT from 'mqtt';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
}));

const LightIconStyled = styled(LightIcon)({
    width: "48px",
    height: "48px",
    flexShrink: 0,
    marginRight: "10px",
    color: "black",
});

const TungstenIconStyled = styled(TungstenIcon)({
    width: "48px",
    height: "48px",
    flexShrink: 0,
    color: "black",
});

const label = { inputProps: { "aria-label": "Switch demo" } };

const brightnessTextStyle = {
    fontFamily: "Readex Pro",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "20px",
    letterSpacing: "0.25px",
    color: "var(--palette-blue-gray-600, #475569)",
};

const currentStatusTextStyle = {
    fontFamily: "Roboto",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "21px",
    letterSpacing: "0.1px",
    color: "var(--black-high-emphasis, rgba(0, 0, 0, 0.87))",
    textAlign: "center",
    marginLeft: "200px",
};

const customSliderStyle = {
    width: "1px",
    height: "200px",
    borderRadius: "1px",
    background: "#2196F3",
};

const CustomThumb = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="63"
        height="33"
        viewBox="0 0 63 33"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.3243 5.30029C29.6213 7.58324 35.8574 15.5941 43.0474 15.572L46.0501 15.5628C49.1001 15.5534 51.0981 13.0073 51.7959 12.3051C52.8726 11.2118 54.3705 10.5372 56.0305 10.5321C59.3405 10.5219 62.0387 13.1936 62.0489 16.5136C62.0591 19.8336 59.3774 22.5218 56.0674 22.532C54.4074 22.5371 52.9053 21.8717 51.822 20.7951C51.1198 20.0872 49.1062 17.5534 46.0562 17.5628C43.0062 17.5721 43.0535 17.572 43.0535 17.572C35.8636 17.5941 29.6768 25.6432 27.3939 27.9402C24.5128 30.8391 20.5183 32.6413 16.0983 32.6549C7.25835 32.6821 0.0864115 25.5541 0.0492091 16.7042C0.0320067 7.85419 7.16 0.682244 16 0.655073C20.4199 0.641487 24.4254 2.41918 27.3243 5.30029Z"
            fill="#2196F3"
        />
    </svg>
);

// enum LED_STATUS { ON, OFF, AUTO, }
// ON = 0
// OFF = 1
// AUTO = 2


function NodeItem() {

    const navigate = useNavigate();
    const [ledStatus, setLedStatus] = useState(2);
    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState("");
    const [header, setHeader] = useState("");
    const [topic, setTopic] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    // MQTT CODE
    // const wsURL = 'mqtt://test.mosquitto.org:1883';
    // const wsURL = 'ws://test.mosquitto.org:8080';
    const wsURL = "ws://broker.emqx.io:8083/mqtt";
    const options = {
        keepalive: 60,
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
            topic: 'WillMsg',
            payload: 'Connection Closed abnormally..!',
            qos: 0,
            retain: false
        },
        // rejectUnauthorized: false,
        // username: 'check_admin',
        // password: 'check_admin',
    };
    const client = MQTT.connect(wsURL, options);

    useEffect(() => {
        // MQTT CODE
        // Subscribe to topics
        client.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to MQTT broker');
            client.subscribe(topic, (err) => {
                if (!err) {
                    console.log('Subscribed to topic:', topic);
                }
            });
        });
        // error message
        client.on('error', (error) => {
            console.error('MQTT connection error:', error);
        });
        client.on('reconnect', () => {
            console.log("reconnecting");
            setIsConnected(true);
        });
        client.on('offline', () => {
            console.log("client goes offline");
        });
        // close message
        client.on('close', () => {
            console.log('Connection closed');
        });
        // Handle incoming messages
        client.on('message', (topic, payload) => {
            console.log(`Received message on topic ${topic}: ${payload.toString()}`);
        });
        return () => {
            // Unsubscribe and disconnect on component unmount
            client.end(() => {
                console.log('MQTT Disconnected');
                setIsConnected(false);
            });
        };
    }, [topic]);

    useEffect(() => {
        const type = searchParams.get('type');
        const filter = searchParams.get('filter');
        if (!type || !filter) {
            navigate('/overview');
            return;
        }
        setType(type);
        setHeader(`Details for ${filter}`);
        setTopic(`${type}/${filter}`);
    }, [navigate, searchParams]);

    // MQTT PUB CODE
    const publish_led_status = (value) => {
        // Publish the message to the specified topic
        client.publish(topic, String(value), (err) => {
            if (!err) {
                console.log('Message published:', value);
            }
            setLedStatus(value);
        });
    };
    // MQTT PUB CODE



    return (
        <>
            <Box marginLeft={4}>

                <Typography
                    variant="h4"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, marginLeft: 0, marginTop: 2 }}
                >
                    {header}
                </Typography>

            </Box>

            <Grid container spacing={2}>

                {/* BRIGTHNESS */}
                <Grid item xs={4}>
                    <Item>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                            }}
                        >
                            <Box marginTop={1} />
                            <LightIconStyled data-testid="Light" />
                            <Switch {...label} defaultChecked />
                        </div>
                        <Box marginTop={4} />
                        <div style={{ ...brightnessTextStyle, alignSelf: "flex-start" }}>
                            Brightness
                        </div>
                        <Box marginTop={1} />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                            }}
                        >
                            <TungstenIconStyled data-testid="Tungsten" />
                            <Box sx={{ width: 300 }}>
                                <Slider
                                    defaultValue={50}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                        </div>
                        <Box marginTop={10} />
                    </Item>
                </Grid>
                {/* CURRENT STATUS */}
                <Grid item xs={4}>
                    <Item>
                        <div style={currentStatusTextStyle}>Current Status</div>
                        <Grid
                            container
                            direction="row"
                            spacing={7}
                            style={{ height: "246px" }}
                            marginLeft="10px"
                            marginBottom="40px"
                        >
                            <Grid item style={{ height: "150px" }}>
                                <div style={{ height: "150px" }}>
                                    <Slider
                                        aria-label="Temperature"
                                        orientation="vertical"
                                        valueLabelDisplay="auto"
                                        defaultValue={30}
                                        valueLabelFormat={(value) => `Temperature: ${value} °C`}
                                    />
                                    <p style={{ textAlign: "center" }}>Temperature</p>
                                </div>
                            </Grid>
                            <Grid item style={{ height: "150px" }}>
                                <div style={{ height: "150px" }}>
                                    <Slider
                                        aria-label="Humidity"
                                        orientation="vertical"
                                        defaultValue={30}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `Humidity ${value} %`}
                                    />
                                    <p style={{ textAlign: "center" }}>Humidity</p>
                                </div>
                            </Grid>
                            <Grid item style={{ height: "150px" }}>
                                <div style={{ height: "150px" }}>
                                    <Slider
                                        getAriaLabel={() => "Pressure (hpa)"}
                                        orientation="vertical"
                                        defaultValue={1.5}
                                        min={0.0}
                                        max={5.0}
                                        step={0.1}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `Pressure: ${value}`}
                                    />
                                    <p style={{ textAlign: "center" }}>Pressure (hpa)</p>
                                </div>
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>

                {/* MQTT TOGGLE */}
                <Grid item xs={4}>
                    <Item>
                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ ...currentStatusTextStyle }}
                        >
                            LED TOGGLE (via MQTT)
                        </Typography>

                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>
                                    <Button variant="contained" {...bindTrigger(popupState)}>
                                        {ledStatus === 0 && "ON"}
                                        {ledStatus === 1 && "OFF"}
                                        {ledStatus === 2 && "AUTO"}
                                    </Button>

                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {
                                            publish_led_status(0);
                                            popupState.close();
                                        }}>
                                            On
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            publish_led_status(1);
                                            popupState.close();
                                        }}>
                                            Off
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            publish_led_status(2);
                                            popupState.close();
                                        }}>
                                            Auto
                                        </MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>

                    </Item>
                </Grid>
            </Grid>
        </>
    );
}

export default NodeItem;
