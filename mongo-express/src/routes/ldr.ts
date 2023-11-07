import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send("ldr page");
});

export default router;