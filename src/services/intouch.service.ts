import { IntouchTransferResponse, TransactionStatus, Wallet } from '../types';
import logger from '../utils/logger.util';

interface TransferRequest {
  sourceWallet: Wallet;
  destinationWallet: Wallet;
  destinationPhone: string;
  amount: number;
}

/**
 * Mock InTouch API Service
 * This is a mock implementation that simulates the InTouch API
 * In production, this would make actual HTTP calls to the InTouch API
 */
class IntouchService {
  private mockTransactions: Map<string, IntouchTransferResponse> = new Map();

  /**
   * Initiate a transfer (MOCK implementation)
   * Returns a mock transaction ID and sets status to PENDING
   */
  async initiateTransfer(request: TransferRequest): Promise<IntouchTransferResponse> {
    // Generate mock transaction ID
    const transactionId = `INT${Date.now()}`;

    const response: IntouchTransferResponse = {
      transaction_id: transactionId,
      status: TransactionStatus.PENDING,
      message: 'Transfer initiated successfully',
    };

    // Store mock transaction
    this.mockTransactions.set(transactionId, response);

    logger.info(`[MOCK INTOUCH] Initiated transfer ${transactionId}`, {
      sourceWallet: request.sourceWallet,
      destinationWallet: request.destinationWallet,
      amount: request.amount,
    });

    // Simulate async processing - randomly succeed or fail after 2-5 seconds
    this.simulateAsyncProcessing(transactionId);

    return response;
  }

  /**
   * Get transaction status (MOCK implementation)
   */
  async getTransactionStatus(intouchTransactionId: string): Promise<IntouchTransferResponse> {
    const transaction = this.mockTransactions.get(intouchTransactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    logger.info(`[MOCK INTOUCH] Getting status for ${intouchTransactionId}: ${transaction.status}`);

    return transaction;
  }

  /**
   * Simulate async transaction processing
   * Randomly updates transaction to SUCCESS (80%) or FAILED (20%) after 2-5 seconds
   */
  private simulateAsyncProcessing(transactionId: string): void {
    const delay = Math.floor(2000 + Math.random() * 3000); // 2-5 seconds
    const willSucceed = Math.random() < 0.8; // 80% success rate

    setTimeout(() => {
      const transaction = this.mockTransactions.get(transactionId);
      if (transaction) {
        transaction.status = willSucceed ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
        transaction.message = willSucceed
          ? 'Transfer completed successfully'
          : 'Transfer failed due to insufficient funds';

        this.mockTransactions.set(transactionId, transaction);

        logger.info(`[MOCK INTOUCH] Transaction ${transactionId} updated to ${transaction.status}`);
      }
    }, delay);
  }

  /**
   * Validate that the wallet type is supported
   */
  isSupportedWallet(wallet: string): boolean {
    return Object.values(Wallet).includes(wallet as Wallet);
  }
}

export default new IntouchService();
