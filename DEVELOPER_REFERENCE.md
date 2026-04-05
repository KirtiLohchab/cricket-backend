# Cricket Backend - Developer Quick Reference

Fast lookup guide for developers working with this codebase.

## 📁 File Locations Quick Map

| Feature              | File                                | Purpose                        |
| -------------------- | ----------------------------------- | ------------------------------ |
| **OTP Logic**        | `src/utils/otpUtils.js`             | Generate, validate, expire OTP |
| **JWT Tokens**       | `src/utils/jwtUtils.js`             | Create, verify JWT tokens      |
| **Email Sending**    | `src/services/emailService.js`      | Send emails via SMTP           |
| **SMS Sending**      | `src/services/smsService.js`        | Send SMS via Twilio            |
| **Input Validation** | `src/utils/validationUtils.js`      | Joi schemas & validation       |
| **Auth Endpoints**   | `src/routes/authRoutes.js`          | OTP & JWT routes               |
| **User Endpoints**   | `src/routes/userRoutes.js`          | Registration & profile routes  |
| **Auth Logic**       | `src/controllers/authController.js` | OTP & token handling           |
| **User Logic**       | `src/controllers/userController.js` | Registration & profiles        |
| **Auth Middleware**  | `src/middlewares/authMiddleware.js` | JWT verification               |
| **Error Handler**    | `src/middlewares/errorHandler.js`   | Global error handling          |
| **Rate Limiting**    | `src/middlewares/rateLimiter.js`    | Request throttling             |
| **Database Schema**  | `prisma/schema.prisma`              | All models & relations         |
| **Database Seeding** | `prisma/seed.js`                    | Initial data setup             |
| **Main Server**      | `server.js`                         | Entry point & middleware setup |
| **DB Connection**    | `db.js`                             | PostgreSQL connection          |

---

## 🔑 Key Functions

### OTP Utils

```javascript
import {
  generateOTP,
  getOTPExpiryTime,
  isOTPExpired,
  isMaxOTPAttemptsExceeded,
} from "./utils/otpUtils.js";

const otp = generateOTP(); // Generate 6-digit OTP
const expiry = getOTPExpiryTime(10); // Expiry 10 min from now
const expired = isOTPExpired(expiresAt); // Check if expired
const locked = isMaxOTPAttemptsExceeded(attempts); // Check if Max attempts reached
```

### JWT Utils

```javascript
import {
  generateToken,
  verifyToken,
  decodeToken,
  extractTokenFromHeader,
} from "./utils/jwtUtils.js";

const token = generateToken(userId, { email: "user@example.com" }); // Create token
const decoded = verifyToken(token); // Verify token
const payload = decodeToken(token); // Decode without verify
const token2 = extractTokenFromHeader("Bearer xyz123"); // Extract from header
```

### Validation Utils

```javascript
import {
  validateInput,
  sendOTPSchema,
  verifyOTPSchema,
  registerPlayerSchema,
} from "./utils/validationUtils.js";

const { error, value } = validateInput(data, sendOTPSchema); // Validate & get errors
```

### Helpers

```javascript
import {
  calculateAge,
  formatPhoneNumber,
  maskEmail,
  maskPhoneNumber,
} from "./utils/helpers.js";

const age = calculateAge(dob); // Calculate age from DOB
const formatted = formatPhoneNumber("9876543210"); // Format as +919876543210
const masked = maskEmail("user@example.com"); // Mask: us**@example.com
const masked2 = maskPhoneNumber("919876543210"); // Mask: ***3210
```

### Email Service

```javascript
import {
  sendOTPEmail,
  sendWelcomeEmail,
  sendLoginConfirmationEmail,
} from "./services/emailService.js";

await sendOTPEmail("user@example.com", "123456", "User Name");
await sendWelcomeEmail("user@example.com", "First Name");
await sendLoginConfirmationEmail("user@example.com", "First Name", timestamp);
```

### SMS Service

```javascript
import {
  sendOTPSMS,
  sendWelcomeSMS,
  sendLoginGreetingSMS,
} from "./services/smsService.js";

await sendOTPSMS("919876543210", "123456");
await sendWelcomeSMS("919876543210", "First Name");
await sendLoginGreetingSMS("919876543210", "First Name");
```

---

## 🏗️ Adding New Features

### Add New API Endpoint

1. **Create Controller Function** in `src/controllers/newController.js`:

```javascript
export const newFeature = async (req, res) => {
  try {
    // Business logic
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
```

2. **Add Validation Schema** in `src/utils/validationUtils.js`:

```javascript
export const newFeatureSchema = Joi.object({
  field1: Joi.string().required(),
  field2: Joi.number().optional(),
});
```

3. **Create Route** in `src/routes/newRoutes.js`:

```javascript
import express from "express";
import { newFeature } from "../controllers/newController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/endpoint", authMiddleware, newFeature);
export default router;
```

4. **Register Route** in `server.js`:

```javascript
import newRoutes from "./src/routes/newRoutes.js";
app.use("/api/new", newRoutes);
```

---

### Add New Database Model

1. **Update** `prisma/schema.prisma`:

```prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@map("new_models")
}
```

2. **Run Migration**:

```bash
npm run prisma:migrate
```

3. **Use in Code**:

```javascript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const newModel = await prisma.newModel.create({
  data: { name: "test", userId: userId },
});
```

---

## 🐛 Common Debug Scenarios

### Debug OTP Not Received

```javascript
// In authController.js sendOTP function
console.log('OTP Generated:', otp);
console.log('Sending to:', email || phone);
console.log('Email Service Result:', result);

// Enable debug mode
DEBUG=* npm run dev
```

### Debug JWT Not Working

```javascript
// Check token in route
console.log("Auth Header:", req.headers.authorization);
console.log("Extracted Token:", token);
console.log("Decoded Token:", decoded);

// Verify token manually
import { decodeToken } from "./utils/jwtUtils.js";
console.log(decodeToken("your_token_here"));
```

### Debug Database Issues

```bash
# View database GUI
npx prisma studio

# Check latest migrations
npx prisma migrate status

# Reset database
npm run db:reset
```

---

## 🚨 Error Response Status Codes

| Code | Use Case           | Example                         |
| ---- | ------------------ | ------------------------------- |
| 200  | Successful request | OTP verified, profile retrieved |
| 201  | Resource created   | Player registered               |
| 400  | Bad request        | Invalid input, validation error |
| 401  | Unauthorized       | Missing/invalid JWT token       |
| 404  | Not found          | User not found                  |
| 429  | Too many requests  | Rate limit exceeded             |
| 500  | Server error       | Database error, service error   |

---

## 📋 Response Format Template

```javascript
// Success
res.status(200).json({
  success: true,
  message: "Operation successful",
  data: {
    /* actual data */
  },
});

// Validation Error
res.status(400).json({
  success: false,
  message: "Validation failed",
  errors: [{ field: "email", message: "Invalid email" }],
});

// Server Error
res.status(500).json({
  success: false,
  message: "Failed to complete operation",
  error: error.message, // Only in development
});
```

---

## 🔍 Debugging Commands

```bash
# Full debug output
DEBUG=* npm run dev

# Nodemon debug
node --inspect server.js

# Prisma queries debug
DEBUG=prisma:* npm run dev

# Database connection debug
DEBUG=pg:* npm run dev

# View Prisma Studio
npx prisma studio

# Validate schema
npx prisma validate
```

---

## 🔐 Environment Variables Reference

```env
# Required for running
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=strong_secret_key

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@gmail.com
SMTP_PASS=app_password

# SMS configuration
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=yyy
TWILIO_PHONE_NUMBER=+1234567890

# Feature configuration
OTP_EXPIRY_TIME=10
OTP_LENGTH=6
JWT_EXPIRE=7d

# Server configuration
NODE_ENV=development
PORT=3000
```

---

## 📊 Database Query Examples

```javascript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create user
const user = await prisma.user.create({
  data: { email: "user@example.com", phone: "919876543210" },
});

// Find user
const user = await prisma.user.findUnique({ where: { id: userId } });
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});

// Update user
await prisma.user.update({
  where: { id: userId },
  data: { isEmailVerified: true },
});

// Delete user (cascade to OTP and PlayerProfile)
await prisma.user.delete({ where: { id: userId } });

// Create OTP
const otp = await prisma.oTP.create({
  data: { phone: "919876543210", code: "123456", expiresAt: new Date() },
});

// Find with relations
const profile = await prisma.playerProfile.findUnique({
  where: { userId: userId },
  include: { state: true, district: true, user: true },
});

// Create player profile
const profile = await prisma.playerProfile.create({
  data: {
    userId,
    firstName: "John",
    lastName: "Doe",
    // ... other fields
  },
});

// Query with filter
const users = await prisma.user.findMany({
  where: { isEmailVerified: true },
});

// Count records
const count = await prisma.playerProfile.count();

// Delete specific record
await prisma.oTP.deleteMany({ where: { status: "EXPIRED" } });

// Close connection
await prisma.$disconnect();
```

---

## 🧪 Testing One Endpoint

**Method 1: cURL**

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Method 2: VS Code REST Client**
Create `test.http`:

```http
POST http://localhost:3000/api/auth/send-otp
Content-Type: application/json

{
  "email": "test@example.com"
}
```

**Method 3: Node Script**

```javascript
const response = await fetch("http://localhost:3000/api/auth/send-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@example.com" }),
});
const data = await response.json();
console.log(data);
```

---

## 🔄 Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin main
```

Commit Message Format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests

---

## 📞 Common Issues & Quick Fixes

| Issue                 | Solution                                |
| --------------------- | --------------------------------------- |
| OTP expires too fast  | Increase `OTP_EXPIRY_TIME` in `.env`    |
| Rate limit too strict | Adjust rate limiter in `rateLimiter.js` |
| Email not sending     | Check SMTP credentials in `.env`        |
| SMS not sending       | Verify Twilio credentials               |
| Database locked       | Restart database connection             |
| Port already in use   | Use `PORT=3001 npm run dev`             |
| Token invalid         | Generate new token via OTP              |
| Validation failing    | Check schema in `validationUtils.js`    |

---

**Last Updated**: April 2024  
**Maintained By**: Development Team
