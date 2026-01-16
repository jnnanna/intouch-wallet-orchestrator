import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';
import { generateToken } from '../utils/jwt.util';
import otpService from './otp.service';
import logger from '../utils/logger.util';
import { RegisterDto, LoginDto, VerifyOtpDto, AuthUser } from '../types';

const prisma = new PrismaClient();

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<{ userId: string; message: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or phone already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        isVerified: false,
      },
    });

    // Generate and send OTP
    const otpCode = await otpService.generateAndSendOTP(data.phone);

    // Store OTP in database
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await prisma.oTP.create({
      data: {
        phone: data.phone,
        code: otpCode,
        expiresAt,
        verified: false,
      },
    });

    logger.info(`User registered: ${user.id}`);

    return {
      userId: user.id,
      message: 'OTP sent to phone',
    };
  }

  /**
   * Verify OTP and return JWT token
   */
  async verifyOTP(data: VerifyOtpDto): Promise<{ token: string; user: AuthUser }> {
    // Find valid OTP
    const otp = await prisma.oTP.findFirst({
      where: {
        phone: data.phone,
        code: data.code,
        verified: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otp) {
      throw new Error('Invalid or expired OTP');
    }

    // Mark OTP as verified
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // Update user as verified
    const user = await prisma.user.update({
      where: { phone: data.phone },
      data: { isVerified: true },
    });

    // Generate JWT token
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };

    const token = generateToken(authUser);

    logger.info(`User verified: ${user.id}`);

    return { token, user: authUser };
  }

  /**
   * Login with email and password
   */
  async login(data: LoginDto): Promise<{ token: string; user: AuthUser }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Please verify your phone number first');
    }

    // Generate JWT token
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };

    const token = generateToken(authUser);

    logger.info(`User logged in: ${user.id}`);

    return { token, user: authUser };
  }
}

export default new AuthService();
