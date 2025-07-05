import express from "express";
import { getDashboardData } from "../../controllers/admin/dashboard-controller.js";
import checkAuth from "../../middleware/checkAuth.js";

const router = express.Router();

// GET /admin/dashboard - Get dashboard statistics
router.get("/dashboard", checkAuth, getDashboardData);

export default router;
