import { Request, Response, NextFunction } from 'express';
import { startSession, ClientSession } from 'mongoose';
import authSchema from '../../models/users/auth-schema.js';
import HttpError from '../../models/Http-Error.js';
import UserAddressSchema from '../../models/users/address-schema.js';
import { IUser, IAddress } from '../../types/user.types.js';

interface UserDetailRequest extends Request {
  params: {
    userId: string;
  };
  body: {
    firstName: string;
    lastName?: string;
    city: string;
    phone: string;
    pincode: string;
    email: string;
    address: string;
    apartment?: string;
  };
}

export const userDetailController = async (req: UserDetailRequest, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;
  const {
    firstName,
    lastName,
    city,
    phone,
    pincode,
    email,
    address,
    apartment
  } = req.body;

  if (!userId) {
    return next(new HttpError(400, 'User ID is required'));
  }

  const session: ClientSession = await startSession();

  try {
    session.startTransaction();

    const user: IUser | null = await authSchema.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return next(new HttpError(404, 'User not found'));
    }

    let userAddress: IAddress | null = await UserAddressSchema.findOne({ user: userId }).session(session);

    if (!userAddress) {
      userAddress = new UserAddressSchema({
        user: userId,
        firstName,
        lastName,
        city,
        phone,
        pincode,
        email,
        address,
        apartment
      });
      await userAddress.save({ session });

      user.address = [userAddress._id as any]; // set ref in user schema
      await user.save({ session });
    } else {
      userAddress.set({
        firstName,
        lastName,
        city,
        phone,
        pincode,
        email,
        address,
        apartment
      });
      await userAddress.save({ session });

      // optional: ensure user.address is synced
      if (!user.address || user.address.length === 0) {
        user.address = [userAddress._id as any];
        await user.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      addressId: userAddress._id
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during address save:', error);
    return next(new HttpError(500, 'Failed to save address'));
  }
}; 