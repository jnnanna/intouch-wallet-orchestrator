import { Router } from 'express';
import * as transferController from '../controllers/transfer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, createTransferSchema } from '../middleware/validation.middleware';

const router = Router();

/**
 * POST /api/transfers
 * Create a new transfer
 */
router.post('/', authenticate, validate(createTransferSchema), transferController.createTransfer);

/**
 * GET /api/transfers/:id/status
 * Get transfer status
 */
router.get('/:id/status', authenticate, transferController.getTransferStatus);

export default router;
