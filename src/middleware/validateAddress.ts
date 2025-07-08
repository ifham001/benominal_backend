import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateUserDetails: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isAlpha('en-IN', { ignore: ' ' }).withMessage('First name should contain only letters'),

  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isAlpha('en-IN', { ignore: ' ' }).withMessage('Last name should contain only letters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),

  body('address')
    .notEmpty().withMessage('Address is required'),

  body('apartment')
    .optional()
    .isString().withMessage('Apartment must be a string'),

  body('city')
    .notEmpty().withMessage('City is required')
    .isAlpha('en-IN', { ignore: ' ' }).withMessage('City must only contain letters'),

  body('pincode')
    .notEmpty().withMessage('Pincode is required')
    .matches(/^\d{6}$/).withMessage('Invalid Indian pincode'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
]; 