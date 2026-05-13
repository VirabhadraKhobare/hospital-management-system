export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const payload = {
    message: err.message || 'Internal Server Error'
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  if (err?.name === 'ValidationError') {
    payload.validation = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
  }

  if (err?.code === 11000) {
    payload.message = 'Duplicate field value entered.';
    payload.duplicateKey = err.keyValue;
  }

  res.status(statusCode).json(payload);
};
