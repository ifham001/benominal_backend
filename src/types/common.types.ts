import { Request } from 'express';
import { Types } from 'mongoose';

// Custom Error Class
export class HttpError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

// Authentication Request Interface
export interface AuthRequest extends Request {
  user?: {
    id: Types.ObjectId;
    email?: string;
    phone?: string;
    role?: string;
  };
}

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination Interface
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// File Upload Interface
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// JWT Payload Interface
export interface JWTPayload {
  id: string;
  email?: string;
  phone?: string;
  role?: string;
  iat?: number;
  exp?: number;
} 