import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';
import HttpError from '../model/error/Http-error.js';
 



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid,authToken);

// Temporary in-memory store (for demo only)
const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async (toNumber) => {
  const otp = generateOTP();
  otpStore.set(toNumber, otp);

  const message = `Your WhatsApp login code is: ${otp}`;

  try {
    await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Twilio sandbox number
      to: `whatsapp:${toNumber}`,
    });

    console.log(`✅ OTP sent to ${toNumber}: ${otp}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send OTP to ${toNumber}:`, error);
    return new HttpError(500,'Failed to send OTP');
  }
};

export const verifyOTP = (toNumber, inputOtp) => {
  const validOtp = otpStore.get(toNumber);
  return inputOtp === validOtp;
};
