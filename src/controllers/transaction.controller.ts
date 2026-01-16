import { Response, NextFunction } from 'express';
import transactionService from '../services/transaction.service';
import { AuthRequest, PaginationParams, TransactionStatus } from '../types';

export const getTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as TransactionStatus | undefined;

    const params: PaginationParams = {
      page,
      limit,
      status,
    };

    const result = await transactionService.getUserTransactions(req.user.id, params);

    res.status(200).json({
      success: true,
      transactions: result.items.map((t) => ({
        id: t.id,
        sourceWallet: t.sourceWallet,
        destinationWallet: t.destinationWallet,
        amount: t.amount,
        status: t.status,
        createdAt: t.createdAt,
      })),
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
