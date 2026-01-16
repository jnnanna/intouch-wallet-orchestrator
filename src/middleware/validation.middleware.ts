import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors,
          },
        });
      }

      next(error);
    }
  };
};

// Validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z
    .string()
    .regex(/^[0-9]{12}$/, 'Phone must be 12 digits (e.g., 221771234567)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[0-9]{12}$/, 'Phone must be 12 digits'),
  code: z.string().regex(/^[0-9]{6}$/, 'OTP must be 6 digits'),
});

export const createTransferSchema = z.object({
  sourceWallet: z.enum(['WAVE', 'ORANGE', 'FREE_MONEY'], {
    errorMap: () => ({ message: 'Invalid source wallet' }),
  }),
  destinationWallet: z.enum(['WAVE', 'ORANGE', 'FREE_MONEY'], {
    errorMap: () => ({ message: 'Invalid destination wallet' }),
  }),
  destinationPhone: z.string().regex(/^[0-9]{12}$/, 'Phone must be 12 digits'),
  amount: z.number().positive('Amount must be greater than 0'),
});
