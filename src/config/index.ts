import dotenv from 'dotenv';

dotenv.config();

interface Config {
  env: string;
  port: number;
  databaseUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  intouch: {
    apiKey: string;
    baseUrl: string;
    webhookSecret: string;
  };
  otp: {
    expiryMinutes: number;
  };
  logging: {
    level: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  intouch: {
    apiKey: process.env.IN_TOUCH_API_KEY || 'mock-api-key',
    baseUrl: process.env.IN_TOUCH_BASE_URL || 'https://sandbox.intouch.api/v1',
    webhookSecret: process.env.IN_TOUCH_WEBHOOK_SECRET || 'mock-webhook-secret',
  },
  otp: {
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

export default config;
