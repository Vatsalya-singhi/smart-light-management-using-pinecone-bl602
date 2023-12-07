import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import { MQTTPublisher } from './mqtt_pub';

const port = process.env.PORT || 3000;
const mqttpub = new MQTTPublisher();

const app = express();

app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// demo api endpoints
app.get('/', (req, res) => {
    res.status(200).send('Pinecone Middleman Server is running');
});

// api to accept reading from pinecone
app.post('/send-sensor-readings', (req, res) => {
    const payload = req.body.payload;
    console.log("payload=>", payload);
    res.status(200).send("recieved payload");
})