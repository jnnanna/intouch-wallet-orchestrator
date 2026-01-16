import { PrismaClient } from '@prisma/client';
import intouchService from './intouch.service';
import logger from '../utils/logger.util';
import {
  CreateTransferDto,
  TransactionStatus,
  PaginationParams,
  PaginatedResponse,
} from '../types';

const prisma = new PrismaClient();

interface Transaction {
  id: string;
  sourceWallet: string;
  destinationWallet: string;
  destinationPhone: string;
  amount: number;
  status: string;
  intouchTransactionId: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class TransactionService {
  /**
   * Create a new transfer transaction
   */
  async createTransfer(
    userId: string,
    data: CreateTransferDto
  ): Promise<Transaction> {
    // Validate wallets are supported
    if (!intouchService.isSupportedWallet(data.sourceWallet)) {
      throw new Error(`Unsupported source wallet: ${data.sourceWallet}`);
    }

    if (!intouchService.isSupportedWallet(data.destinationWallet)) {
      throw new Error(`Unsupported destination wallet: ${data.destinationWallet}`);
    }

    // Validate amount
    if (data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Initiate transfer with InTouch
    const intouchResponse = await intouchService.initiateTransfer({
      sourceWallet: data.sourceWallet,
      destinationWallet: data.destinationWallet,
      destinationPhone: data.destinationPhone,
      amount: data.amount,
    });

    // Create transaction in database
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        sourceWallet: data.sourceWallet,
        destinationWallet: data.destinationWallet,
        destinationPhone: data.destinationPhone,
        amount: data.amount,
        status: intouchResponse.status,
        intouchTransactionId: intouchResponse.transaction_id,
      },
    });

    logger.info(`Transfer created: ${transaction.id}`, {
      userId,
      intouchTransactionId: intouchResponse.transaction_id,
    });

    return transaction;
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(
    userId: string,
    transactionId: string
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // If transaction is still pending, check InTouch for updates
    if (transaction.status === TransactionStatus.PENDING && transaction.intouchTransactionId) {
      try {
        const intouchStatus = await intouchService.getTransactionStatus(
          transaction.intouchTransactionId
        );

        // Update transaction status if changed
        if (intouchStatus.status !== transaction.status) {
          const updatedTransaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
              status: intouchStatus.status,
              errorMessage: intouchStatus.message,
            },
          });

          logger.info(`Transaction status updated: ${transactionId} -> ${intouchStatus.status}`);

          return updatedTransaction;
        }
      } catch (error) {
        logger.error('Error checking InTouch status:', error);
      }
    }

    return transaction;
  }

  /**
   * Get user transactions with pagination
   */
  async getUserTransactions(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedResponse<Transaction>> {
    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Update transaction status (for webhook)
   */
  async updateTransactionStatus(
    intouchTransactionId: string,
    status: TransactionStatus,
    errorMessage?: string
  ): Promise<Transaction> {
    const transaction = await prisma.transaction.update({
      where: { intouchTransactionId },
      data: {
        status,
        errorMessage,
      },
    });

    logger.info(`Transaction status updated via webhook: ${transaction.id} -> ${status}`);

    return transaction;
  }
}

export default new TransactionService();
