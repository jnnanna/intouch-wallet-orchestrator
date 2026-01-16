import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import transferRoutes from './routes/transfer.routes';
import webhookRoutes from './routes/webhook.routes';
import { getTransactions } from './controllers/transaction.controller';
import { authenticate } from './middleware/auth.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';
import logger from './utils/logger.util';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later',
    },
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/webhooks', webhookRoutes);
app.get('/api/transactions', authenticate, getTransactions);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
