
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const mongodb_username = process.env.MONGODB_USERNAME;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_collection_1 = process.env.MONGODB_COLLECTION_1;
// const mongodb_collection_iot_frames = process.env.MONGODB_COLLECTION_IOT_FRAMES;


const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@cluster0.gjddfqy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function insertOne(doc) {
    try {
        // Connect to the database
        const db = client.db(mongodb_database);
        // insert doc into collection
        const result = await db.collection(mongodb_collection_1).insertOne({ ...doc });
        // Print the ID of the inserted document
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // Close the MongoDB client connection
        // await client.close(true);
    }
}

async function insertMany(docList) {
    try {
        // Connect to the database
        const db = client.db(mongodb_database);
        // insert doc into collection
        // best practice for max throughput
        const result = await db.collection(mongodb_collection_1).insertMany(docList, { ordered: false }); 
        // Print result
        console.log(`${result.insertedCount} documents were inserted`);
    } finally {
        // Close the MongoDB client connection
        // await client.close(true);
    }
}

module.exports = {
    insertOne,
    insertMany,
};

async function run() {
    const db = client.db(mongodb_database);
    const countDocuments = await db.collection(mongodb_collection).countDocuments();
    const stats = await db.stats({ scale: 1024 });
    console.log("countDocuments=>", countDocuments);
    console.log("stats=>", stats);
}

// run().catch((err) => console.log(err));