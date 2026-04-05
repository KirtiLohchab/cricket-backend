# Cricket Backend - Complete System

A comprehensive Node.js + Express backend for cricket player registration, management, and selection with OTP-based authentication.

## 🎯 Overview

This project provides a complete backend solution for managing cricket player registrations with:

- OTP-based authentication (Email & SMS)
- Multi-step player registration flow
- JWT-based authorization
- Professional email and SMS notifications
- PostgreSQL database with Prisma ORM
- Complete API documentation
- Production-ready error handling and security

## 📋 Quick Start

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone Repository**

   ```bash
   git clone <repo-url>
   cd cricket-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Setup Environment**

   ```bash
   cp env-sample .env
   # Edit .env with your credentials
   ```

4. **Initialize Database**

   ```bash
   npm run db:setup
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

## 📦 Available Commands

```bash
npm run dev                 # Start with hot reload (Nodemon)
npm start                  # Start production server
npm run prisma:migrate     # Run Prisma migrations
npm run prisma:seed        # Seed database with initial data
npm run db:setup          # Setup database (migrate + seed)
npm run db:reset          # Reset database completely
npm run prisma:generate   # Generate Prisma client
```

## 🏗️ Architecture

### Project Structure

```
src/
├── controllers/       # Business logic & route handlers
├── routes/           # API route definitions
├── middlewares/      # Authentication, error handling, rate limiting
├── services/         # Email & SMS service integration
├── utils/            # Helper functions, validation, JWT
└── config/           # Configuration files
```

### Key Components

**Controllers**

- `authController.js` - OTP generation, verification, JWT
- `userController.js` - Player registration & profile management

**Services**

- `emailService.js` - Nodemailer SMTP integration
- `smsService.js` - Twilio SMS integration

**Utils**

- `otpUtils.js` - OTP generation & validation
- `jwtUtils.js` - JWT token handling
- `validationUtils.js` - Joi schema validation
- `helpers.js` - General utility functions

**Middlewares**

- `authMiddleware.js` - JWT verification
- `errorHandler.js` - Global error handling
- `rateLimiter.js` - Rate limiting

## 🔐 Authentication Flow

```
1. User sends phone/email → POST /api/auth/send-otp
   ↓
2. OTP sent via email/SMS
   ↓
3. User verifies OTP → POST /api/auth/verify-otp
   ↓
4. JWT token returned
   ↓
5. Use token for authenticated requests
   Authorization: Bearer <TOKEN>
   ↓
6. If new user → register → POST /api/users/register
   If existing → login complete
```

## 📱 Registration Flow

```
Step 1: User Authentication
├── SMS/Email OTP verification
└── JWT token generation

Step 2: Player Profile Creation
├── Personal Information
│   ├── Name fields (First, Last, Father, Mother)
│   ├── Date of Birth
│   └── Age Category (Under-16, Open)
├── Location Selection
│   ├── State selection
│   ├── District selection (district dependent on state)
│   └── City text input
├── Player Details
│   ├── Player Role (Batsman, Bowler, All-Rounder, Wicket Keeper)
│   ├── Trial State
│   └── Trial District
└── Notifications
    ├── Welcome email
    └── Welcome SMS

Step 3: Profile Management
├── View profile
├── Update profile
└── Manage trial opportunities
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & Get Token
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/logout` - Logout

### Users

- `POST /api/users/register` - Register Player
- `GET /api/users/profile` - Get Profile
- `PUT /api/users/profile` - Update Profile
- `GET /api/users/states` - Get States List
- `GET /api/users/districts/:stateId` - Get Districts

**Detailed API documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 📊 Database Schema

### Models

- **User** - User accounts with verification status
- **OTP** - OTP records with expiry and status tracking
- **PlayerProfile** - Detailed player information
- **State** - Indian states list
- **District** - Districts within each state
- **AuditLog** - Action tracking and logging

### Key Enums

- **AgeCategoryEnum**: UNDER_16, OPEN_AGE
- **PlayerRoleEnum**: BATSMAN, BOWLER, ALL_ROUNDER, WICKET_KEEPER
- **OTPMethodEnum**: EMAIL, PHONE
- **OTPStatusEnum**: PENDING, VERIFIED, EXPIRED

## ⚙️ Configuration

### Email Setup (Gmail SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@cricket.com
```

### SMS Setup (Twilio)

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### JWT Configuration

```env
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

## 🛡️ Security Features

- ✅ JWT-based authentication
- ✅ Rate limiting on sensitive endpoints
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with Joi
- ✅ Password hashing with bcryptjs
- ✅ OTP attempt limiting
- ✅ OTP expiry enforcement
- ✅ SQL injection prevention (Prisma)

## 📝 Error Handling

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)",
  "errors": [
    /* validation errors */
  ]
}
```

## 🧪 Testing

### Using Postman / cURL

1. **Send OTP**

   ```bash
   curl -X POST http://localhost:3000/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com"}'
   ```

2. **Verify OTP**

   ```bash
   curl -X POST http://localhost:3000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","code":"123456"}'
   ```

3. **Get States**

   ```bash
   curl -X GET http://localhost:3000/api/users/states
   ```

4. **Register Player** (with JWT token)
   ```bash
   curl -X POST http://localhost:3000/api/users/register \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{ /* registration data */ }'
   ```

## 🚀 Deployment

### Steps for Production

1. **Update Environment Variables**
   - Set `NODE_ENV=production`
   - Use production database URL
   - Generate strong JWT secret
   - Configure production email/SMS credentials

2. **Database Setup**
   - Migrate schema: `npm run prisma:migrate`
   - Seed data: `npm run prisma:seed`

3. **Use Process Manager**

   ```bash
   npm install -g pm2
   pm2 start server.js --name cricket-api
   ```

4. **Setup Reverse Proxy**
   - Configure Nginx/Apache for SSL
   - Set up rate limiting at proxy level
   - Enable gzip compression

5. **Monitoring & Logging**
   - Setup centralized logging
   - Configure error tracking (Sentry, etc.)
   - Monitor database performance

## 📚 Documentation

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions (if available)

## 🤝 Dependencies

**Core**

- express: Web framework
- @prisma/client: Database ORM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing

**Services**

- nodemailer: Email sending
- twilio: SMS sending

**Validation & Security**

- joi: Input validation
- helmet: Security headers
- cors: CORS protection
- express-rate-limit: Rate limiting

**Development**

- nodemon: Auto-reload server

## 📞 Support & Contact

For issues, questions, or suggestions, please:

1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review error messages and logs
3. Contact development team

## 📄 License

Proprietary - Cricket Backend System

---

**Version**: 1.0.0  
**Last Updated**: April 2024  
**Status**: Production Ready ✅
