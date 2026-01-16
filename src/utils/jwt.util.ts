import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthUser } from '../types';

export const generateToken = (user: AuthUser): string => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
  };

  // Using type assertion to work around StringValue branded type
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): AuthUser => {
  const decoded = jwt.verify(token, config.jwt.secret) as AuthUser;
  return decoded;
};
