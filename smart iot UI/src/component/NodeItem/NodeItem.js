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

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "./NodeItem.css";
import revenueData from "../../assets/data/revenueData.json";
import sourceData from "../../assets/data/sourceData.json";


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
    margin: "auto",
    width: "100%",
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


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

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
    const [liveSensorReading, setLiveSensorReading] = useState({ "brightness": "30", "temperature": "30", "humidity": "30", "pressure": "1.5" });

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

            client.subscribe("live-readings", (err) => {
                if (!err) {
                    console.log('Subscribed to topic: live-readings');
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

            if (topic === "live-readings") {
                console.log("payload=>", JSON.parse(payload.toString()));
                setLiveSensorReading(JSON.parse(payload.toString()));
            }
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
            {/* HEADER */}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
            }}>

                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                    {header}
                </Typography>

            </Box>

            <div style={{ width: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        p: 0.5,
                        marginBlock: 0.5,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                    }}
                >
                    {/* BRIGTHNESS */}
                    <Item
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            p: 1,
                            m: 1,
                            minHeight: "200px",
                            paddingInline: 5,
                        }}>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: 'flex-start',
                                marginBottom: "40px",
                            }}
                        >
                            <Box marginTop={1} />
                            <LightIconStyled data-testid="Light" />
                            <Switch {...label} defaultChecked />
                        </div>

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
                                    key={`slider0-${liveSensorReading['brightness'] || " "}`}
                                    value={Number(liveSensorReading['brightness']) || 50}
                                    aria-label="Default"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={100}
                                />
                            </Box>
                        </div>
                    </Item>

                    {/* LIVE SENSOR READINGS */}
                    <Item
                        sx={{
                            minHeight: "200px",
                            paddingInline: 5,
                        }}>
                        <div style={currentStatusTextStyle}>Live Sensor Readings</div>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                marginBottom: "40px",
                            }}>

                            <Grid item style={{ height: "150px", marginInline: "20px" }}>
                                <div style={{ height: "150px" }}>
                                    <Slider
                                        key={`slider1-${liveSensorReading['temperature'] || " "}`}
                                        aria-label="Temperature"
                                        orientation="vertical"
                                        valueLabelDisplay="auto"
                                        value={Number(liveSensorReading['temperature']) || 30}
                                        valueLabelFormat={(value) => `Temperature: ${value} °C`}
                                        min={-50}
                                        max={50}
                                    />
                                    <p style={{ textAlign: "center" }}>Temperature</p>
                                </div>
                            </Grid>
                            <Grid item style={{ height: "150px", marginInline: "20px" }}>
                                <div style={{ height: "150px" }}>
                                    <Slider
                                        key={`slider2-${liveSensorReading['humidity'] || " "}`}
                                        aria-label="Humidity"
                                        orientation="vertical"
                                        valueLabelDisplay="auto"
                                        value={Number(liveSensorReading['humidity']) || 30}
                                        valueLabelFormat={(value) => `Humidity ${value} %`}
                                        min={0}
                                        max={100}
                                    />
                                    <p style={{ textAlign: "center" }}>Humidity</p>
                                </div>
                            </Grid>
                            <Grid item style={{ height: "150px", marginInline: "20px" }}>
                                <div style={{ height: "150px" }}>
                                    <Slider
                                        key={`slider3-${liveSensorReading['pressure'] || " "}`}
                                        getAriaLabel={() => "Pressure (hpa)"}
                                        orientation="vertical"
                                        valueLabelDisplay="auto"
                                        value={Number(liveSensorReading['pressure']) || 1.5}
                                        valueLabelFormat={(value) => `Pressure: ${value}`}
                                        min={0.0}
                                        max={5.0}
                                        step={0.1}
                                    />
                                    <p style={{ textAlign: "center" }}>Pressure (hpa)</p>
                                </div>
                            </Grid>

                        </Box>
                    </Item>

                    {/* MQTT TOGGLE */}
                    <Item
                        sx={{
                            minHeight: "200px",
                            paddingInline: 5,
                        }}>

                        <div style={{ ...currentStatusTextStyle }}>
                            LED Control System
                            <small style={{ display: "block", fontWeight: 400 }}>
                                (using MQTT Protocol)
                            </small>
                        </div>


                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                p: 1,
                                m: 1,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                width: "100%",
                                height: "100%",
                                minHeight: "200px",
                            }}>

                            <PopupState variant="popover" popupId="demo-popup-menu">
                                {(popupState) => (
                                    <React.Fragment>
                                        <Button variant="contained" {...bindTrigger(popupState)}
                                            color={(ledStatus === 0) ? "success" : (ledStatus === 1 ? "error" : "secondary")}
                                            sx={{
                                                height: "100%",
                                                width: "100%",
                                            }}
                                        >
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

                        </Box>

                    </Item>
                </Box>
            </div>

            <div className="App">
                <div className="dataCard revenueCard">
                    <Line
                        data={{
                            labels: revenueData.map((data) => data.label),
                            datasets: [
                                {
                                    label: "Revenue",
                                    data: revenueData.map((data) => data.revenue),
                                    backgroundColor: "#064FF0",
                                    borderColor: "#064FF0",
                                },
                                {
                                    label: "Cost",
                                    data: revenueData.map((data) => data.cost),
                                    backgroundColor: "#FF3030",
                                    borderColor: "#FF3030",
                                },
                            ],
                        }}
                        options={{
                            elements: {
                                line: {
                                    tension: 0.5,
                                },
                            },
                            plugins: {
                                title: {
                                    text: "Monthly Revenue & Cost",
                                },
                            },
                        }}
                    />
                </div>

                <div className="dataCard customerCard">
                    <Bar
                        data={{
                            labels: sourceData.map((data) => data.label),
                            datasets: [
                                {
                                    label: "Count",
                                    data: sourceData.map((data) => data.value),
                                    backgroundColor: [
                                        "rgba(43, 63, 229, 0.8)",
                                        "rgba(250, 192, 19, 0.8)",
                                        "rgba(253, 135, 135, 0.8)",
                                    ],
                                    borderRadius: 5,
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    text: "Revenue Source",
                                },
                            },
                        }}
                    />
                </div>

                <div className="dataCard categoryCard">
                    <Doughnut
                        data={{
                            labels: sourceData.map((data) => data.label),
                            datasets: [
                                {
                                    label: "Count",
                                    data: sourceData.map((data) => data.value),
                                    backgroundColor: [
                                        "rgba(43, 63, 229, 0.8)",
                                        "rgba(250, 192, 19, 0.8)",
                                        "rgba(253, 135, 135, 0.8)",
                                    ],
                                    borderColor: [
                                        "rgba(43, 63, 229, 0.8)",
                                        "rgba(250, 192, 19, 0.8)",
                                        "rgba(253, 135, 135, 0.8)",
                                    ],
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    text: "Revenue Sources",
                                },
                            },
                        }}
                    />
                </div>
            </div>

        </>
    );
}

export default NodeItem;
