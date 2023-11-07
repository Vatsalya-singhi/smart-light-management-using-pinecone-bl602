import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("iot dumps page");
});

export default router;