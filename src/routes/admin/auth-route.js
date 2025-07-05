import { Router } from "express";
import {signupAdmin,loginAdmin} from '../../controllers/admin/auth-controller.js'

const adminAuthRoute = Router();

adminAuthRoute.post('/signup', signupAdmin);
adminAuthRoute.post('/login', loginAdmin);

export default adminAuthRoute;