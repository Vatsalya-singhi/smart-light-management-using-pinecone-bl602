
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
var _ = require('lodash');

const mongodb_username = process.env.MONGODB_USERNAME;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_collection_iot_frames = process.env.MONGODB_COLLECTION_IOT_FRAMES;
const mongodb_collection_temperature = process.env.MONGODB_COLLECTION_TEMPERATURE;
const mongodb_collection_led_status = process.env.MONGODB_COLLECTION_LED_STATUS;
const mongodb_collection_luminosity = process.env.MONGODB_COLLECTION_LUMINOSITY;
const mongodb_collection_proximity = process.env.MONGODB_COLLECTION_PROXIMITY;
const mongodb_collection_ldr = process.env.MONGODB_COLLECTION_LDR;


const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@cluster0.gjddfqy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function save_iot_frame_dumps(docList) {
    try {
        // Connect to the database
        const db = client.db(mongodb_database);
        // insert doc into collection
        const result = await db.collection(mongodb_collection_iot_frames).insertMany(docList, {
            ordered: false, // best practice for max throughput
        });
        // Print result
        console.log(`${result.insertedCount} documents were inserted`);
    } finally {
        // Close the MongoDB client connection
        // await client.close(true);
    }
}


async function processIOTFrames(docList) {
    await save_iot_frame_dumps(docList);
}

module.exports = {
    processIOTFrames,
};

async function run() {
    const db = client.db(mongodb_database);
    const countDocuments = await db.collection(mongodb_collection).countDocuments();
    const stats = await db.stats({ scale: 1024 });
    console.log("countDocuments=>", countDocuments);
    console.log("stats=>", stats);
}

// run().catch((err) => console.log(err));