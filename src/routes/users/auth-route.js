import {Router} from "express";
import { sendCodeOnWhatsApp ,googleAuth,verifyCodeAndlogin } from "../../controllers/users/auth-controller.js";

let authrouter = Router();

// Route to send OTP via WhatsApp
// userAuthrouter.post("/send-otp", sendOtpOnWhatsApp);
authrouter.post('/google-login', googleAuth);
authrouter.post('/send-otp', sendCodeOnWhatsApp)
authrouter.post('/verify-otp', verifyCodeAndlogin);


export default authrouter;