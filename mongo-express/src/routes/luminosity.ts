import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("luminosity page");
});

export default router;