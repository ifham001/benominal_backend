import { Router } from "express";
import { signupAdmin, loginAdmin } from "../../controllers/admin/auth-controller.js";

const adminAuthRoute: Router = Router();

// Admin authentication routes
adminAuthRoute.post('/signup', signupAdmin);
adminAuthRoute.post('/login', loginAdmin);

export default adminAuthRoute; 