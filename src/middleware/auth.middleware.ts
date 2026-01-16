import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { AuthRequest } from '../types';
import logger from '../utils/logger.util';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const user = verifyToken(token);
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        },
      });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};
