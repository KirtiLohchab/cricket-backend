# Cricket Backend API Documentation

A comprehensive Node.js/Express backend system for cricket player registration and management with OTP-based authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Authentication](#authentication)

## ✨ Features

- **OTP-Based Authentication**
  - Send OTP via Email or Phone
  - Verify OTP and get JWT token
  - Resend OTP functionality
  - Rate limiting on OTP endpoints

- **Player Registration**
  - Multi-step registration flow
  - Form validation
  - State and District selection
  - Age category verification
  - Player role selection
  - Trial opportunity selection

- **User Management**
  - User profile management
  - Player profile creation and updates
  - Profile retrieval with related data

- **Security**
  - JWT-based authentication
  - Rate limiting on sensitive endpoints
  - CORS protection
  - Helmet security headers
  - Input validation

- **Notifications**
  - Welcome emails
  - OTP emails
  - Login confirmation emails
  - SMS notifications via Twilio
  - Professional email templates

## 🛠 Tech Stack

- **Backend Framework**: Express.js 5.x
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Email Service**: Nodemailer (Gmail SMTP)
- **SMS Service**: Twilio
- **Validation**: Joi
- **Security**: Helmet, CORS, bcryptjs
- **Rate Limiting**: express-rate-limit
- **Development**: Nodemon

## 📁 Project Structure

```
cricket-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # OTP and authentication logic
│   │   └── userController.js      # User registration and profile
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── userRoutes.js          # User endpoints
│   ├── middlewares/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── errorHandler.js        # Global error handling
│   │   └── rateLimiter.js         # Rate limiting
│   ├── services/
│   │   ├── emailService.js        # Email sending
│   │   └── smsService.js          # SMS sending
│   ├── utils/
│   │   ├── otpUtils.js            # OTP utilities
│   │   ├── jwtUtils.js            # JWT utilities
│   │   ├── validationUtils.js     # Joi schemas and validation
│   │   └── helpers.js             # Helper functions
│   └── config/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.js                    # Database seeding script
├── server.js                      # Server entry point
├── db.js                          # Database connection
├── .env                           # Environment variables
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cricket-backend
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment Variables

```bash
# Copy the env-sample file
cp env-sample .env

# Update .env with your configurations:
# - Database URL (PostgreSQL)
# - SMTP credentials (Gmail)
# - Twilio credentials
# - JWT secret
```

### 4. Setup Database

```bash
# Run migrations
npm run prisma:migrate

# Seed initial data (states and districts)
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Send OTP

**POST** `/api/auth/send-otp`

Send OTP to user's email or phone.

**Request Body:**

```json
{
  "phone": "9876543210",
  "email": "user@example.com"
}
```

Note: Provide either `phone` or `email` (at least one is required).

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otpId": "clu1a2b3c4d5e6f7",
    "method": "email",
    "target": "us**@example.com",
    "expiresIn": 10
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "phone",
      "message": "\"phone\" must be a valid phone number"
    }
  ]
}
```

---

#### 2. Verify OTP

**POST** `/api/auth/verify-otp`

Verify OTP and get JWT token.

**Request Body:**

```json
{
  "phone": "9876543210",
  "code": "123456"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "userId": "user123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "phone": "919876543210",
      "isNewUser": true
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

---

#### 3. Resend OTP

**POST** `/api/auth/resend-otp`

Resend OTP to user's email or phone.

**Request Body:**

```json
{
  "phone": "9876543210",
  "otpId": "clu1a2b3c4d5e6f7"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP resent successfully",
  "data": {
    "otpId": "clu1a2b3c4d5e6f7",
    "method": "phone",
    "expiresIn": 10
  }
}
```

---

#### 4. Logout

**POST** `/api/auth/logout`

User logout endpoint.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### User Endpoints

#### 1. Register Player

**POST** `/api/users/register`

Register a new player with profile information.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**

```json
{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "fatherName": "Ramesh Kumar",
  "motherName": "Lakshmi",
  "dateOfBirth": "2005-06-15",
  "ageCategory": "UNDER_16",
  "stateId": "state_id_123",
  "districtId": "district_id_456",
  "city": "Mumbai",
  "playerRole": "BATSMAN",
  "trialStateId": "state_id_789",
  "trialDistrictId": "district_id_101"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Player registered successfully",
  "data": {
    "playerProfile": {
      "id": "profile123",
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "fatherName": "Ramesh Kumar",
      "motherName": "Lakshmi",
      "dateOfBirth": "2005-06-15T00:00:00.000Z",
      "age": 18,
      "ageCategory": "UNDER_16",
      "state": "Maharashtra",
      "district": "Mumbai",
      "city": "Mumbai",
      "playerRole": "BATSMAN",
      "trialState": "Maharashtra",
      "trialDistrict": "Pune",
      "createdAt": "2024-04-05T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "firstName",
      "message": "\"firstName\" is required"
    }
  ]
}
```

---

#### 2. Get User Profile

**GET** `/api/users/profile`

Retrieve user profile with player information.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "userId": "user123",
    "email": "user@example.com",
    "phone": "919876543210",
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "createdAt": "2024-04-05T10:00:00.000Z",
    "playerProfile": {
      "id": "profile123",
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "fatherName": "Ramesh Kumar",
      "motherName": "Lakshmi",
      "dateOfBirth": "2005-06-15T00:00:00.000Z",
      "age": 18,
      "ageCategory": "UNDER_16",
      "state": "Maharashtra",
      "stateId": "state_id_123",
      "district": "Mumbai",
      "districtId": "district_id_456",
      "city": "Mumbai",
      "playerRole": "BATSMAN",
      "trialState": "Maharashtra",
      "trialStateId": "state_id_789",
      "trialDistrict": "Pune",
      "trialDistrictId": "district_id_101",
      "createdAt": "2024-04-05T10:30:00.000Z",
      "updatedAt": "2024-04-05T10:30:00.000Z"
    }
  }
}
```

---

#### 3. Update Player Profile

**PUT** `/api/users/profile`

Update player profile information.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**

```json
{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "city": "Bangalore",
  "playerRole": "ALL_ROUNDER",
  "districtId": "district_id_999",
  "stateId": "state_id_999"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Player profile updated successfully",
  "data": {
    "playerProfile": {
      "id": "profile123",
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "city": "Bangalore",
      "playerRole": "ALL_ROUNDER",
      "updatedAt": "2024-04-05T11:00:00.000Z"
    }
  }
}
```

---

#### 4. Get All States

**GET** `/api/users/states`

Retrieve list of all states.

**Success Response (200):**

```json
{
  "success": true,
  "message": "States retrieved successfully",
  "data": {
    "states": [
      {
        "id": "state_id_1",
        "name": "Maharashtra",
        "code": "MH"
      },
      {
        "id": "state_id_2",
        "name": "Delhi",
        "code": "DL"
      },
      {
        "id": "state_id_3",
        "name": "Karnataka",
        "code": "KA"
      }
    ]
  }
}
```

---

#### 5. Get Districts by State

**GET** `/api/users/districts/:stateId`

Retrieve districts for a specific state.

**URL Parameters:**

- `stateId` (string, required): ID of the state

**Success Response (200):**

```json
{
  "success": true,
  "message": "Districts retrieved successfully",
  "data": {
    "districts": [
      {
        "id": "district_id_1",
        "name": "Mumbai",
        "code": null
      },
      {
        "id": "district_id_2",
        "name": "Pune",
        "code": null
      },
      {
        "id": "district_id_3",
        "name": "Nagpur",
        "code": null
      }
    ]
  }
}
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header.

**Format:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Token Generation:**

- Token is generated after successful OTP verification
- Token expires in the time specified in `JWT_EXPIRE` environment variable (default: 7 days)
- Include token with every authenticated request

**Token Payload:**

```json
{
  "userId": "user123",
  "email": "user@example.com",
  "phone": "919876543210",
  "iat": 1712282400,
  "exp": 1712887200
}
```

---

## ⚠️ Error Handling

All errors return a consistent format:

**Error Response Format:**

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (only in development)",
  "errors": []
}
```

**Common Error Codes:**

| Code | Message                         | Cause                        |
| ---- | ------------------------------- | ---------------------------- |
| 400  | Validation failed               | Invalid input data           |
| 400  | Invalid OTP                     | Wrong OTP code               |
| 400  | OTP has expired                 | OTP validity period exceeded |
| 401  | Authorization header is missing | Missing JWT token            |
| 401  | Invalid or expired token        | Invalid/expired JWT token    |
| 404  | User not found                  | User doesn't exist           |
| 404  | Route not found                 | Invalid endpoint             |
| 429  | Too many requests               | Rate limit exceeded          |
| 500  | Internal server error           | Server error                 |

---

## 📊 Database Schema

### User Table

```sql
- id (String, Primary Key, CUID)
- phone (String, Unique, Optional)
- email (String, Unique, Optional)
- isPhoneVerified (Boolean, Default: false)
- isEmailVerified (Boolean, Default: false)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### OTP Table

```sql
- id (String, Primary Key, CUID)
- userId (String, Foreign Key, Optional)
- phone (String, Optional)
- email (String, Optional)
- code (String)
- method (Enum: EMAIL, PHONE)
- status (Enum: PENDING, VERIFIED, EXPIRED)
- attempts (Int, Default: 0)
- expiresAt (DateTime)
- createdAt (DateTime)
- updatedAt (DateTime)
```

### PlayerProfile Table

```sql
- id (String, Primary Key, CUID)
- userId (String, Unique, Foreign Key)
- firstName (String)
- lastName (String)
- fatherName (String)
- motherName (String)
- dateOfBirth (DateTime)
- ageCategory (Enum: UNDER_16, OPEN_AGE)
- stateId (String, Foreign Key)
- districtId (String, Foreign Key)
- city (String)
- playerRole (Enum: BATSMAN, BOWLER, ALL_ROUNDER, WICKET_KEEPER)
- trialStateId (String, Foreign Key)
- trialDistrictId (String, Foreign Key)
- createdAt (DateTime)
- updatedAt (DateTime)
```

---

## 🧪 Testing the API

### Using cURL

**1. Send OTP:**

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**2. Verify OTP:**

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","code":"123456"}'
```

**3. Get States:**

```bash
curl -X GET http://localhost:3000/api/users/states
```

**4. Register Player:**

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "firstName":"Rajesh",
    "lastName":"Kumar",
    "fatherName":"Ramesh",
    "motherName":"Lakshmi",
    "dateOfBirth":"2005-06-15",
    "ageCategory":"UNDER_16",
    "stateId":"state_id",
    "districtId":"district_id",
    "city":"Mumbai",
    "playerRole":"BATSMAN",
    "trialStateId":"state_id",
    "trialDistrictId":"district_id"
  }'
```

---

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```env
# Application
NODE_ENV=development
APP_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host/db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=app_password
SMTP_FROM=noreply@cricket.com

# Twilio SMS
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# OTP
OTP_EXPIRY_TIME=10
OTP_LENGTH=6

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📝 Notes

- **OTP Validity**: Default 10 minutes, configurable via `OTP_EXPIRY_TIME`
- **Rate Limiting**: Prevent brute force attacks on OTP endpoints
- **Database**: Uses PostgreSQL with Prisma ORM for type safety
- **Security**: All passwords are hashed using bcryptjs
- **CORS**: Configured for specified origins
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

---

## 🚀 Deployment

For production deployment:

1. Update all environment variables with production values
2. Set `NODE_ENV=production`
3. Use a process manager like PM2
4. Set up SSL/TLS certificates
5. Configure proper database backups
6. Set up monitoring and logging

---

## 📞 Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: April 2024
