// models/HttpError.ts

class HttpError extends Error {
    public statusCode: number;
    
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'HttpError';
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
export default HttpError;
  