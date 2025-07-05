import authSchema from '../../models/users/auth-schema.js';
import HttpError from '../../models/Http-Error.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";
import twilio from 'twilio';
import dotenv from 'dotenv';
import adminAuthSchema from '../../models/admin/admin-schema.js';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const googleClientId = process.env.GOOGLE_CLIENT_ID_OAUTH;

const client = twilio(accountSid, authToken);

// ✅ Send OTP
export const sendCodeOnWhatsApp = async (req, res, next) => {
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

// ✅ Verify OTP and Login or Create User
export const verifyCodeAndlogin = async (req, res, next) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) return next(new HttpError(400, 'Phone number and OTP are required'));

  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      let user = await authSchema.findOne({ phone: phoneNumber });

      if (!user) {
        user = new authSchema({
          username: `User_${Date.now()}`,
          phone: phoneNumber,
          authProvider: 'phone',
        });
        await user.save();

        // Add user to adminAuthSchema
        let admin = await adminAuthSchema.findOne();
        if (!admin) {
          admin = new adminAuthSchema({ users: [user._id] });
        } else if (!admin.users.includes(user._id)) {
          admin.users.push(user._id);
        }
        await admin.save();
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        idToken: token,
        userId: user._id,
      });
    } else {
      return res.status(400).json({ message: '❌ OTP verification failed', status: 'failed' });
    }
  } catch (error) {
    console.error(error);
    return next(new HttpError(500, 'Failed to verify OTP'));
  }
};

// ✅ Google Auth
export const googleAuth = async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) return next(new HttpError(400, 'Missing Google credential'));

  const client = new OAuth2Client(googleClientId);

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await authSchema.findOne({ email });

    if (!user) {
      user = new authSchema({
        username: name,
        email,
        authProvider: 'google',
      });
      await user.save();

      // Add user to adminAuthSchema
      let admin = await adminAuthSchema.findOne();
      if (!admin) {
        admin = new adminAuthSchema({ users: [user._id] });
      } else if (!admin.users.includes(user._id)) {
        admin.users.push(user._id);
      }
      await admin.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      idToken: token,
      userId: user._id,
    });
  } catch (error) {
    console.error('🔴 Google authentication failed:', error);
    return next(new HttpError(401, 'Google login failed'));
  }
};
