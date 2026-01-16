import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import transactionService from '../services/transaction.service';
import config from '../config';
import logger from '../utils/logger.util';
import { WebhookPayload, TransactionStatus } from '../types';

const router = Router();

/**
 * Verify HMAC signature for webhook
 */
const verifyWebhookSignature = (payload: string, signature: string): boolean => {
  const hmac = crypto.createHmac('sha256', config.intouch.webhookSecret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
};

/**
 * POST /api/webhooks/intouch
 * Handle InTouch webhook callbacks
 */
router.post('/intouch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: WebhookPayload = req.body;

    // Verify signature
    const payloadString = JSON.stringify(payload);
    const isValid = verifyWebhookSignature(payloadString, payload.signature);

    if (!isValid) {
      logger.warn('Invalid webhook signature');
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid signature',
        },
      });
    }

    // Update transaction status
    await transactionService.updateTransactionStatus(
      payload.transaction_id,
      payload.status,
      payload.status === TransactionStatus.FAILED ? 'Transaction failed' : undefined
    );

    logger.info(`Webhook processed for transaction: ${payload.transaction_id}`);

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
