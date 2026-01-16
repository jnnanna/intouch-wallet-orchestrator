import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthUser } from '../types';

export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

export const verifyToken = (token: string): AuthUser => {
  const decoded = jwt.verify(token, config.jwt.secret) as AuthUser;
  return decoded;
};
