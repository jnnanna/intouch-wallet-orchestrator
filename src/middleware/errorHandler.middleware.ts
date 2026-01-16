import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.util';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error response
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';

  // Handle specific error types
  if (err.message.includes('not found')) {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    message = err.message;
  } else if (
    err.message.includes('Invalid') ||
    err.message.includes('required') ||
    err.message.includes('must be')
  ) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
  } else if (
    err.message.includes('Unauthorized') ||
    err.message.includes('credentials') ||
    err.message.includes('token')
  ) {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    message = err.message;
  } else if (err.message.includes('already exists')) {
    statusCode = 409;
    errorCode = 'CONFLICT';
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
};
