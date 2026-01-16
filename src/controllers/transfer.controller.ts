import { Response, NextFunction } from 'express';
import transactionService from '../services/transaction.service';
import { AuthRequest, CreateTransferDto } from '../types';

export const createTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const data: CreateTransferDto = req.body;
    const transaction = await transactionService.createTransfer(req.user.id, data);

    res.status(201).json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        intouchTransactionId: transaction.intouchTransactionId,
        sourceWallet: transaction.sourceWallet,
        destinationWallet: transaction.destinationWallet,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransferStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { id } = req.params;
    const transaction = await transactionService.getTransactionStatus(req.user.id, id as string);

    res.status(200).json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        intouchTransactionId: transaction.intouchTransactionId,
        updatedAt: transaction.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
