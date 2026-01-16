import { Request } from 'express';

export enum Wallet {
  WAVE = 'WAVE',
  ORANGE = 'ORANGE',
  FREE_MONEY = 'FREE_MONEY',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
}

export interface CreateTransferDto {
  sourceWallet: Wallet;
  destinationWallet: Wallet;
  destinationPhone: string;
  amount: number;
}

export interface IntouchTransferResponse {
  transaction_id: string;
  status: TransactionStatus;
  message?: string;
}

export interface WebhookPayload {
  transaction_id: string;
  status: TransactionStatus;
  timestamp: string;
  signature: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  status?: TransactionStatus;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
