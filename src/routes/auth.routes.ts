import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema, verifyOtpSchema } from '../middleware/validation.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * POST /api/auth/verify-otp
 * Verify OTP and get JWT token
 */
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOTP);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', validate(loginSchema), authController.login);

export default router;
