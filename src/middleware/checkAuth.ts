import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import HttpError from '../models/Http-Error.js';
import { AuthRequest, JWTPayload } from '../types/common.types.js';

dotenv.config();

const checkAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'No token provided'));
  }

  const token: string = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = {
      id: decoded.id as any,
      email: decoded.email,
      phone: decoded.phone,
      role: decoded.role
    };
    next();
  } catch (err) {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
};

export default checkAuth; 