# InTouch Wallet Orchestrator

A fintech MVP backend application that orchestrates wallet-to-wallet transfers using InTouch API as the financial engine. This system handles authentication, transaction management, and InTouch API integration (currently mocked for development).

## 🚀 Tech Stack

- **Runtime**: Node.js (LTS v20.x)
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (email+password + OTP verification)
- **Testing**: Jest + Supertest
- **Linting**: ESLint + Prettier
- **Git hooks**: Husky
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js**: v20.x or later ([Download](https://nodejs.org/))
- **PostgreSQL**: v14 or later ([Download](https://www.postgresql.org/download/))
- **npm**: v10.x or later (comes with Node.js)

## 🛠️ Local Setup (Without Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/jnnanna/intouch-wallet-orchestrator.git
cd intouch-wallet-orchestrator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL Database

Make sure PostgreSQL is running on your machine, then create a new database:

```bash
# Using psql command-line tool
createdb intouch_wallet_dev

# Or connect to PostgreSQL and create database
psql -U postgres
CREATE DATABASE intouch_wallet_dev;
\q
```

### 4. Configure Environment Variables

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

Edit `.env` file and update the following:

```env
# Server
NODE_ENV=development
PORT=3000

# Database - Update with your PostgreSQL credentials
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/intouch_wallet_dev

# JWT - Change this to a secure secret in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# InTouch API (mock for now)
IN_TOUCH_API_KEY=mock-api-key
IN_TOUCH_BASE_URL=https://sandbox.intouch.api/v1
IN_TOUCH_WEBHOOK_SECRET=mock-webhook-secret

# OTP
OTP_EXPIRY_MINUTES=5

# Logging
LOG_LEVEL=debug
```

### 5. Run Prisma Migrations

Generate the database schema and run migrations:

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 6. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`. You should see:

```
🚀 Server running on port 3000
📝 Environment: development
🔗 Health check: http://localhost:3000/health
```

### 7. Verify Installation

Test that the server is running:

```bash
curl http://localhost:3000/health
```

You should receive:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-16T14:52:05.331Z"
}
```

## 📁 Project Structure

```
intouch-wallet-orchestrator/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── transfer.controller.ts
│   │   └── transaction.controller.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── transfer.routes.ts
│   │   └── webhook.routes.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── intouch.service.ts (MOCK)
│   │   ├── otp.service.ts (MOCK)
│   │   └── transaction.service.ts
│   ├── utils/               # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── bcrypt.util.ts
│   │   └── logger.util.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── config/              # Configuration loader
│   │   └── index.ts
│   ├── app.ts               # Express app setup
│   └── server.ts            # Entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── tests/                   # Test files
│   ├── auth.test.ts
│   ├── transfer.test.ts
│   └── setup.ts
├── docs/                    # Documentation
│   ├── openapi.yaml         # OpenAPI 3.0 specification
│   └── postman_collection.json
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline
└── ...
```

## 🔌 API Documentation

### Authentication Flow

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "221771234567",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to phone",
  "userId": "uuid"
}
```

#### 2. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "221771234567",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "221771234567"
  }
}
```

#### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Transfer Operations

#### Create Transfer
```http
POST /api/transfers
Authorization: Bearer {token}
Content-Type: application/json

{
  "sourceWallet": "WAVE",
  "destinationWallet": "ORANGE",
  "destinationPhone": "221771234567",
  "amount": 5000
}
```

#### Get Transfer Status
```http
GET /api/transfers/{id}/status
Authorization: Bearer {token}
```

#### Get User Transactions
```http
GET /api/transactions?page=1&limit=20&status=SUCCESS
Authorization: Bearer {token}
```

For complete API documentation, see:
- **OpenAPI Spec**: [docs/openapi.yaml](docs/openapi.yaml)
- **Postman Collection**: [docs/postman_collection.json](docs/postman_collection.json)

## 🧪 Testing

Run the test suite:

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

**Note:** Some integration tests require a database connection and are currently skipped. The test suite includes:
- ✅ Validation tests (11 passing)
- ⏸️ Database integration tests (2 skipped - require PostgreSQL setup)

To run the full test suite, set up a test database and update the `DATABASE_URL` in your test environment.

## 🎨 Code Quality

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

### Git Hooks

Husky is configured to run linting and formatting checks before commits:

```bash
# Install git hooks
npm run prepare
```

## 🗄️ Database Management

### Prisma Commands

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT signing | Required (change in production) |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `IN_TOUCH_API_KEY` | InTouch API key | `mock-api-key` |
| `IN_TOUCH_BASE_URL` | InTouch API base URL | `https://sandbox.intouch.api/v1` |
| `IN_TOUCH_WEBHOOK_SECRET` | Webhook signature secret | `mock-webhook-secret` |
| `OTP_EXPIRY_MINUTES` | OTP expiration time | `5` |
| `LOG_LEVEL` | Logging level | `debug` |

## 🎭 Mock Services

This MVP includes two mock services that simulate external dependencies:

### 1. OTP Service (`src/services/otp.service.ts`)

**Current Behavior:**
- Generates a random 6-digit OTP code
- Logs the code to the console (for testing)
- Stores OTP in database with 5-minute expiry
- Accepts any valid 6-digit code for verification

**Production Integration:**
Replace with actual SMS provider (e.g., Twilio, AWS SNS) by updating the `generateAndSendOTP` method.

### 2. InTouch Service (`src/services/intouch.service.ts`)

**Current Behavior:**
- Returns mock transaction IDs (e.g., `INT1234567890`)
- Simulates async processing (2-5 seconds delay)
- Randomly succeeds (80%) or fails (20%)
- Supports wallets: WAVE, ORANGE, FREE_MONEY

**Production Integration:**
Replace mock methods with actual HTTP calls to InTouch API. The service interface is designed for easy swapping:

```typescript
// Current mock implementation
class IntouchService {
  async initiateTransfer(request: TransferRequest): Promise<IntouchTransferResponse> {
    // Mock logic
  }
}

// Future real implementation
class IntouchService {
  async initiateTransfer(request: TransferRequest): Promise<IntouchTransferResponse> {
    // Make actual HTTP request to InTouch API
    const response = await axios.post(
      `${config.intouch.baseUrl}/transfers`,
      request,
      { headers: { 'X-API-Key': config.intouch.apiKey } }
    );
    return response.data;
  }
}
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT authentication with expiration
- ✅ CORS enabled with configurable origins
- ✅ Helmet.js for security headers
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ HMAC signature verification for webhooks
- ✅ Input validation with Zod schemas
- ✅ Sensitive data never logged

## 📊 Supported Wallets

The system supports the following mobile money wallets:

- **WAVE** - Wave Mobile Money
- **ORANGE** - Orange Money
- **FREE_MONEY** - Free Money

All amounts are in **XOF (CFA franc)** and should be whole numbers.

## 🚦 CI/CD Pipeline

GitHub Actions workflow runs on every push and pull request:

1. ✅ Lint code with ESLint
2. ✅ Check code formatting with Prettier
3. ✅ Run test suite with coverage
4. ✅ Report test results

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.

## 🏗️ Production Deployment

### Build for Production

```bash
# Compile TypeScript to JavaScript
npm run build

# Start production server
npm start
```

The compiled code will be in the `dist/` directory.

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong, unique value
- [ ] Update `DATABASE_URL` to production database
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Replace mock OTP service with real SMS provider
- [ ] Replace mock InTouch service with real API integration
- [ ] Setup proper logging aggregation
- [ ] Configure SSL/TLS certificates
- [ ] Setup database backups
- [ ] Configure monitoring and alerts

## 🔄 Next Steps

### Integrating Real InTouch API

When InTouch API access becomes available:

1. **Update Configuration** (`src/config/index.ts`):
   - Set real API credentials in `.env`

2. **Update InTouch Service** (`src/services/intouch.service.ts`):
   - Replace mock methods with HTTP requests
   - Add proper error handling
   - Implement retry logic for failed requests

3. **Update OTP Service** (`src/services/otp.service.ts`):
   - Integrate SMS provider (Twilio, AWS SNS, etc.)
   - Update validation logic to check database

4. **Testing**:
   - Test with InTouch sandbox environment
   - Verify webhook signature validation
   - Test all transaction scenarios

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature/my-feature`
7. Submit a pull request

## 📝 License

MIT

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for seamless wallet transfers**