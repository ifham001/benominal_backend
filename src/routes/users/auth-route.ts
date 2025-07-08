import { Router } from "express";
import { sendCodeOnWhatsApp, googleAuth, verifyCodeAndlogin } from "../../controllers/users/auth-controller.js";

const authrouter: Router = Router();

// Route to send OTP via WhatsApp
authrouter.post('/google-login', googleAuth);
authrouter.post('/send-otp', sendCodeOnWhatsApp);
authrouter.post('/verify-otp', verifyCodeAndlogin);

export default authrouter; 