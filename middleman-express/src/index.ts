import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import { MQTTPublisher } from './mqtt_pub';

const app = express();
// const mqttpub = new MQTTPublisher();
const port = process.env.PORT || 3000;
enum LED_STATUS {
    ON,
    OFF,
    AUTO,
}
var led_status = LED_STATUS.AUTO;


app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// demo api endpoints
app.get('/', (req, res) => {
    res.status(200).send('Pinecone Middleman Server is running');
});

// api endpoint to accept sensor reading from pinecone
app.post('/send-sensor-readings', (req, res) => {
    const payload = req.body.payload;
    console.log("payload=>", payload);
    // if (mqttpub.isconnected()) {
    //     mqttpub.publishData();
    // }
    res.status(200).send("recieved payload");
})


// api endpoint to send led status to pinecone
app.get('/new-led-status', (req, res) => {
    res.status(200).send({
        status: led_status,
    })
})

// api endpoint to accept updated led status from UI
app.get('/update-led-status', (req, res) => {
    try {
        const new_value = Number(req.query.led_status as string);
        switch (new_value) {
            case 0:
                led_status = LED_STATUS.ON;
                break;
            case 1:
                led_status = LED_STATUS.OFF;
                break;
            case 2:
                led_status = LED_STATUS.AUTO;
                break;
            default:
                led_status = LED_STATUS.AUTO;
                break;
        }
        console.log('new led_status=>', led_status);
        res.status(200).send("led status updated");
    } catch (err) {
        res.status(200).send("led status not updated");
    }

})

