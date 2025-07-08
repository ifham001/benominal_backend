import { Request, Response, NextFunction } from 'express';
import authSchema from '../../models/users/auth-schema.js';
import HttpError from '../../models/Http-Error.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";
import twilio from 'twilio';
import dotenv from 'dotenv';
import adminAuthSchema from '../../models/admin/admin-schema.js';
import { IUser } from '../../types/user.types.js';
import { IAdmin } from '../../types/admin.types.js';

dotenv.config();

const accountSid: string = process.env.TWILIO_ACCOUNT_SID!;
const authToken: string = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid: string = process.env.TWILIO_SERVICE_SID!;
const googleClientId: string = process.env.GOOGLE_CLIENT_ID_OAUTH!;

const client = twilio(accountSid, authToken);

interface SendOTPRequest extends Request {
  body: {
    phoneNumber: string;
  };
}

interface VerifyOTPRequest extends Request {
  body: {
    phoneNumber: string;
    otp: string;
  };
}

interface GoogleAuthRequest extends Request {
  body: {
    credential: string;
  };
}

// Send OTP
export const sendCodeOnWhatsApp = async (req: SendOTPRequest, res: Response, next: NextFunction): Promise<void> => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return next(new HttpError(400, 'Phone number is required'));

  try {
    await client.verify.v2.services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error('❌ Failed to send OTP:', error);
    return next(new HttpError(500, 'Failed to send OTP'));
  }
};

// Verify OTP and Login or Create User
export const verifyCodeAndlogin = async (req: VerifyOTPRequest, res: Response, next: NextFunction): Promise<void> => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) return next(new HttpError(400, 'Phone number and OTP are required'));

  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      let user: IUser | null = await authSchema.findOne({ phone: phoneNumber });

      if (!user) {
        user = new authSchema({
          username: `User_${Date.now()}`,
          phone: phoneNumber,
          authProvider: 'phone',
        });
        await user.save();

        // Add user to adminAuthSchema
        let admin: IAdmin | null = await adminAuthSchema.findOne();
        if (!admin) {
          admin = new adminAuthSchema({ 
            name: 'Admin',
            email: 'admin@example.com',
            password: 'defaultPassword',
            users: [user._id],
            orders: [],
            products: []
          });
        } else if (!admin.users.includes(user._id as any)) {
          admin.users.push(user._id as any);
        }
        await admin.save();
      }

      const token: string = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      res.status(200).json({
        idToken: token,
        userId: user._id,
      });
    } else {
      res.status(400).json({ message: '❌ OTP verification failed', status: 'failed' });
    }
  } catch (error) {
    console.error(error);
    return next(new HttpError(500, 'Failed to verify OTP'));
  }
};

// Google Auth
export const googleAuth = async (req: GoogleAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { credential } = req.body;
  if (!credential) return next(new HttpError(400, 'Missing Google credential'));

  const client = new OAuth2Client(googleClientId);

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) return next(new HttpError(401, 'Invalid Google token'));

    const { email, name } = payload;

    let user: IUser | null = await authSchema.findOne({ email });

    if (!user) {
      user = new authSchema({
        username: name || `User_${Date.now()}`,
        email,
        authProvider: 'google',
      });
      await user.save();

      // Add user to adminAuthSchema
      let admin: IAdmin | null = await adminAuthSchema.findOne();
      if (!admin) {
        admin = new adminAuthSchema({ 
          name: 'Admin',
          email: 'admin@example.com',
          password: 'defaultPassword',
          users: [user._id],
          orders: [],
          products: []
        });
      } else if (!admin.users.includes(user._id as any)) {
        admin.users.push(user._id as any);
      }
      await admin.save();
    }

    const token: string = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(200).json({
      idToken: token,
      userId: user._id,
    });
  } catch (error) {
    console.error('🔴 Google authentication failed:', error);
    return next(new HttpError(401, 'Google login failed'));
  }
}; 