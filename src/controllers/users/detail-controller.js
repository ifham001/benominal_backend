import { startSession } from 'mongoose';
import authSchema from '../../models/users/auth-schema.js';
import HttpError from '../../models/Http-Error.js';
import UserAddressSchema from '../../models/users/address-schema.js'


export const userDetailController = async (req, res, next) => {
  const {userId} = req.params;
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

  const session = await startSession();

  try {
    session.startTransaction();

    const user = await authSchema.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return next(new HttpError(404, 'User not found'));
    }

    let userAddress = await UserAddressSchema.findOne({ user: userId }).session(session);

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

      user.address = userAddress._id; // set ref in user schema
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
      if (!user.address) {
        user.address = userAddress._id;
        await user.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      addressId:userAddress._id
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during address save:', error);
    return next(new HttpError(500, 'Failed to save address'));
  }
};
