import multer, { StorageEngine } from 'multer';
import { Request } from 'express';
import HttpError from '../models/Http-Error.js';

const storage: StorageEngine = multer.memoryStorage();

// Filter to accept only image files
export const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  // Check if mimetype exists and is an image
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    // console.log('✅ File accepted:', file.originalname);
    cb(null, true);
  } else {
    cb(new HttpError(400, '❌ Only image files are allowed (jpeg, jpg, png, webp, etc.)'));
  }
};

// Multer instance allowing max 3 image uploads (5MB each)
export const uploadMax3Images = multer({
  storage,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },
  fileFilter,
}).array('images', 3); 