import express from "express";
import { getStats, getUptime } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getStats);
router.get("/uptime", getUptime);

export default router;