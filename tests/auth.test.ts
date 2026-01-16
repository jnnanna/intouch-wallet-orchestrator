import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: `test${Date.now()}@example.com`,
        phone: `221771${Math.floor(100000 + Math.random() * 900000)}`,
        password: 'SecurePass123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent to phone');
      expect(response.body.userId).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '221771234567',
        password: 'SecurePass123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with weak password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '221771234567',
        password: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('should fail with invalid OTP format', async () => {
      const otpData = {
        phone: '221771234567',
        code: '123', // Invalid: must be 6 digits
      };

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(otpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should fail with invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing email', async () => {
      const loginData = {
        password: 'Password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Server is running');
    expect(response.body.timestamp).toBeDefined();
  });
});
