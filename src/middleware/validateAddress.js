// middleware/validateUserDetails.js
const { body, validationResult } = require('express-validator');

exports.validateUserDetails = [
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

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
