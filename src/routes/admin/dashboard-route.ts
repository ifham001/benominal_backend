import { Router } from "express";
import { getDashboardData } from "../../controllers/admin/dashboard-controller.js";

const dashboardRoute: Router = Router();

// Admin dashboard routes
dashboardRoute.get('/dashboard', getDashboardData);

// TODO: Add admin dashboard routes here
// dashboardRoute.get('/stats', getStats);
// dashboardRoute.get('/reports', getReports);

export default dashboardRoute; 