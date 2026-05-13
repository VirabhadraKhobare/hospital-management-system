import User from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await User.findById(req.user._id).select('-password');
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'mobile'];
    const payload = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    });

    const profile = await User.findByIdAndUpdate(req.user._id, payload, {
      new: true,
      runValidators: true
    }).select('-password');

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};
