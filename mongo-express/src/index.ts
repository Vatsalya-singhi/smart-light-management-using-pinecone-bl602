import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import temp_router from "./routes/temperature";
import proximity_router from "./routes/proximity";
import luminosity_router from "./routes/luminosity";
import ldr_router from "./routes/ldr";
import led_status_router from "./routes/led_status";
import iot_dumps_router from "./routes/iot_dumps";

// env and configurations
dotenv.config();
const allowedOrigins = []; // ['http://localhost:3000'];
const port = process.env.PORT || 3000;
// env and configurations

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

// router paths
app.use("/iot_dumps", iot_dumps_router);
app.use("/temperature", temp_router);
app.use("/proximity", proximity_router);
app.use("/luminosity", luminosity_router);
app.use("/ldr", ldr_router);
app.use("/led_status", led_status_router);
// router paths

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});