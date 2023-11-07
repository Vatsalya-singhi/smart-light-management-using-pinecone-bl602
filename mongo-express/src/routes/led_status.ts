import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("led status page");
});

export default router;