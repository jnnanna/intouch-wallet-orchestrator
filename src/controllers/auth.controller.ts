import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto } from '../types';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RegisterDto = req.body;
    const result = await authService.register(data);

    res.status(201).json({
      success: true,
      message: result.message,
      userId: result.userId,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: VerifyOtpDto = req.body;
    const result = await authService.verifyOTP(data);

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginDto = req.body;
    const result = await authService.login(data);

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};
