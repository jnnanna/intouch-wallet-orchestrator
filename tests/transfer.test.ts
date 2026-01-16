import request from 'supertest';
import app from '../src/app';
import { generateToken } from '../src/utils/jwt.util';
import { AuthUser } from '../src/types';

const mockUser: AuthUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  phone: '221771234567',
};

const mockToken = generateToken(mockUser);

describe('Transfer Endpoints', () => {
  describe('POST /api/transfers', () => {
    it('should fail without authentication', async () => {
      const transferData = {
        sourceWallet: 'WAVE',
        destinationWallet: 'ORANGE',
        destinationPhone: '221771234567',
        amount: 5000,
      };

      const response = await request(app)
        .post('/api/transfers')
        .send(transferData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should fail with invalid wallet type', async () => {
      const transferData = {
        sourceWallet: 'INVALID_WALLET',
        destinationWallet: 'ORANGE',
        destinationPhone: '221771234567',
        amount: 5000,
      };

      const response = await request(app)
        .post('/api/transfers')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with negative amount', async () => {
      const transferData = {
        sourceWallet: 'WAVE',
        destinationWallet: 'ORANGE',
        destinationPhone: '221771234567',
        amount: -1000,
      };

      const response = await request(app)
        .post('/api/transfers')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with invalid phone format', async () => {
      const transferData = {
        sourceWallet: 'WAVE',
        destinationWallet: 'ORANGE',
        destinationPhone: 'invalid',
        amount: 5000,
      };

      const response = await request(app)
        .post('/api/transfers')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(transferData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/transfers/:id/status', () => {
    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/transfers/some-id/status')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/transactions', () => {
    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
