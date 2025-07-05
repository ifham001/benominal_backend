import jwt from 'jsonwebtoken';
import adminAuthSchema from '../../models/admin/admin-schema.js';
import HttpError from '../../models/Http-Error.js';
import bcrypt from 'bcryptjs';

export const signupAdmin = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new HttpError(400, '❌ All fields are required'));
  }

  try {
    const existingAdmin = await adminAuthSchema.findOne({ email });
    if (existingAdmin) {
      return next(new HttpError(400, '❌ Admin with this email already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new adminAuthSchema({
      name: username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    return res.status(201).json({ message: '✅ Admin created successfully' });
  } catch (error) {
    console.error(error);
    return next(new HttpError(500, 'Failed to create admin'));
  }
};

export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HttpError(400, '❌ Email and password are required'));
  }

  try {
    const admin = await adminAuthSchema.findOne({ email });
    if (!admin) {
      return next(new HttpError(401, '❌ Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return next(new HttpError(401, '❌ Invalid email or password'));
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({
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
