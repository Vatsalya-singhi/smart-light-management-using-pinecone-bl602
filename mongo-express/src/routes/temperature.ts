import express from 'express';
import { conn, db } from '../db_conn';
import dotenv from 'dotenv';
dotenv.config();

const temperature_collection = process.env.MONGODB_COLLECTION_TEMPERATURE;

const router = express.Router();

router.get("/", async (req, res) => {
    let results = await db.collection(temperature_collection)
        .find({})
        .limit(50)
        .toArray();
    res.send(results).status(200);
    // res.send("temperature page");
});

export default router;