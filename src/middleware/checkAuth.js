import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'
import HttpError from '../models/Http-Error.js';
 dotenv.config();

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
};

export default checkAuth;
