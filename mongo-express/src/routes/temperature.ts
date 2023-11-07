import express from 'express';
import { conn, db } from '../db_conn';
import dotenv from 'dotenv';
dotenv.config();

const collection = process.env.MONGODB_COLLECTION_TEMPERATURE;

const router = express.Router();

router.get("/", async (req, res) => {
    let results = await db.collection(collection)
        .find({})
        .limit(50)
        .toArray();
    res.send(results).status(200);
});

export default router;