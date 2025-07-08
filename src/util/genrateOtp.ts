import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';
import HttpError from '../models/Http-Error.js';

const accountSid: string = process.env.TWILIO_ACCOUNT_SID!;
const authToken: string = process.env.TWILIO_AUTH_TOKEN!;

const client = twilio(accountSid, authToken);

// Temporary in-memory store (for demo only)
const otpStore = new Map<string, string>();

const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async (toNumber: string): Promise<boolean | HttpError> => {
  const otp: string = generateOTP();
  otpStore.set(toNumber, otp);

  const message: string = `Your WhatsApp login code is: ${otp}`;

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
    return new HttpError(500, 'Failed to send OTP');
  }
};

export const verifyOTP = (toNumber: string, inputOtp: string): boolean => {
  const validOtp: string | undefined = otpStore.get(toNumber);
  return inputOtp === validOtp;
}; 