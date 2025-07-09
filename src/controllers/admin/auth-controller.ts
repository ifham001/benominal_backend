import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import adminAuthSchema from '../../models/admin/admin-schema';
import HttpError from '../../models/Http-Error';
import bcrypt from 'bcryptjs';
import { IAdmin } from '../../types/admin.types';
import dotenv from 'dotenv';

dotenv.config();

interface AdminSignupRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

interface AdminLoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const signupAdmin = async (req: AdminSignupRequest, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new HttpError(400, '❌ All fields are required'));
  }

  try {
    const existingAdmin: IAdmin | null = await adminAuthSchema.findOne({ email });
    if (existingAdmin) {
      return next(new HttpError(400, '❌ Admin with this email already exists'));
    }

    const hashedPassword: string = await bcrypt.hash(password, 12);

    const newAdmin = new adminAuthSchema({
      name: username,
      email,
      password: hashedPassword,
      users: [],
      orders: [],
      products: []
    });

    await newAdmin.save();

    res.status(201).json({ message: '✅ Admin created successfully' });
  } catch (error) {
    console.error(error);
    return next(new HttpError(500, 'Failed to create admin'));
  }
};

export const loginAdmin = async (req: AdminLoginRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HttpError(400, '❌ Email and password are required'));
  }

  try {
    const admin: IAdmin | null = await adminAuthSchema.findOne({ email });
    if (!admin) {
      return next(new HttpError(401, '❌ Invalid email or password'));
    }

    const isMatch: boolean = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return next(new HttpError(401, '❌ Invalid email or password'));
    }

    const token: string = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: '✅ Admin logged in successfully',
      status: 'success',
      idToken: token,
      adminId: admin._id,
    });
  } catch (error) {
    console.error(error);
    return next(new HttpError(500, 'Failed to login admin'));
  }
}; 