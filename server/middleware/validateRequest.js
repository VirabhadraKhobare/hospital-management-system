import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((error) => ({
    field: error.path,
    message: error.msg
  }));

  return res.status(400).json({
    message: 'Validation failed',
    errors: formatted
  });
};

export default validateRequest;
