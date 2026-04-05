# Troubleshooting Guide - Cricket Backend

## Common Issues and Solutions

### 🔴 Database Connection Issues

#### Issue: `connect ECONNREFUSED 127.0.0.1:5432`

**Cause**: PostgreSQL server is not running or connection details are wrong

**Solution**:

1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env
3. Verify database exists
4. Test connection: `psql <DATABASE_URL>`

---

#### Issue: `error: role "user" does not exist`

**Cause**: Database user doesn't exist or has wrong credentials

**Solution**:

```bash
# Check PostgreSQL users
psql -U postgres -c "\du"

# Create user if needed
psql -U postgres -c "CREATE ROLE cricket_admin WITH LOGIN PASSWORD 'password';"
psql -U postgres -c "ALTER ROLE cricket_admin CREATEDB;"
```

---

### 🔴 OTP Sending Issues

#### Issue: `Failed to send OTP email: connect ECONNREFUSED`

**Cause**: Email service configuration incorrect or SMTP server unreachable

**Solution for Gmail**:

1. Generate App Password:
   - Go to Google Account Settings
   - Enable 2-Factor Authentication
   - Create App Password for Gmail
   - Use in SMTP_PASS

2. Verify credentials in .env:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=generated_app_password
   ```

3. Test email sending:
   ```bash
   # Use Nodemailer debug
   NODE_DEBUG=* npm run dev
   ```

---

#### Issue: Twilio SMS not sending

**Cause**: Twilio credentials incorrect or phone number format issue

**Solution**:

1. Verify Twilio credentials
2. Check phone number format (should start with +)
3. Ensure account has credits
4. Test with Twilio console first
5. Check logs for detailed error

```javascript
// Debug Twilio error
console.log("Twilio Error:", error.message);
console.log("Twilio Code:", error.code);
```

---

### 🔴 Authentication Issues

#### Issue: `Invalid or expired token`

**Cause**: JWT token is invalid, malformed, or has expired

**Solution**:

1. Verify JWT_SECRET in .env matches
2. Check token format: `Bearer <token>`
3. Verify token hasn't expired (check JWT_EXPIRE)
4. Get new token by verifying OTP again

---

#### Issue: `Authorization header is missing`

**Cause**: No Authorization header provided or wrong format

**Solution**:
Ensure request includes header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 🔴 Rate Limiting Issues

#### Issue: `429 Too Many Requests`

**Cause**: Rate limit exceeded on endpoint

**Solution**:

1. Wait for rate limit window to reset (default: 15 minutes)
2. Reduce request frequency
3. Adjust rate limits in `.env`:
   ```env
   RATE_LIMIT_WINDOW=15    # in minutes
   RATE_LIMIT_MAX_REQUESTS=100
   ```

---

#### Issue: OTP rate limit exceeded

**Cause**: Too many OTP requests from same number/email (max 5 per 15 min)

**Solution**:

1. Wait 15 minutes before sending new OTP
2. Use "Resend OTP" endpoint with same OTP ID
3. For development, set `NODE_ENV=development` to disable rate limiting

---

### 🔴 Validation Issues

#### Issue: `Validation failed` with multiple errors

**Cause**: Input data doesn't match schema requirements

**Solution**:

1. Check required fields are provided
2. Verify field formats:
   - Phone: 10 digits starting with 6-9
   - Email: valid email format
   - DOB: YYYY-MM-DD format
   - Age Category: 'UNDER_16' or 'OPEN_AGE'

3. Example valid request:
   ```json
   {
     "phone": "9876543210",
     "email": "user@example.com"
   }
   ```

---

### 🔴 Database Seeding Issues

#### Issue: `Seed failed: unique constraint violated`

**Cause**: Data already exists in database from previous seed

**Solution**:

```bash
# Option 1: Reset database completely
npm run db:reset

# Option 2: Reset and reseed
npm run db:reset
npm run prisma:seed
```

---

#### Issue: States/Districts not in database after seed

**Cause**: Seed script didn't run or database wasn't initialized

**Solution**:

```bash
# Run migrations first
npm run prisma:migrate

# Then seed
npm run prisma:seed

# Verify seeding
```

---

### 🔴 Prisma Issues

#### Issue: `Prisma schema validation error`

**Cause**: Schema syntax error or invalid field definition

**Solution**:

1. Check [prisma/schema.prisma](./prisma/schema.prisma) for syntax
2. Verify field types and relationships
3. Generate client again:
   ```bash
   npm run prisma:generate
   ```

---

#### Issue: `Migration failed: database is locked`

**Cause**: Another process is accessing database

**Solution**:

1. Close other database connections
2. Verify no other migration is running
3. Retry migration:
   ```bash
   npm run prisma:migrate
   ```

---

### 🔴 CORS Issues

#### Issue: `Access to XMLHttpRequest blocked by CORS policy`

**Cause**: Frontend URL not in CORS allowlist

**Solution**:
Update [server.js](./server.js) CORS configuration:

```javascript
app.use(
  cors({
    origin: [
      process.env.UI_BASE_URL || "http://localhost:3000",
      "http://localhost:3001", // Add your frontend URL
      "https://yourdomain.com", // Production URL
    ],
    credentials: true,
  }),
);
```

Then update .env:

```env
UI_BASE_URL=http://localhost:3001
```

---

### 🔴 Port Already in Use

#### Issue: `EADDRINUSE: address already in use :::3000`

**Cause**: Another process using port 3000

**Solution**:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

---

### 🔴 Module Import Issues

#### Issue: `Cannot find module '@prisma/client'`

**Cause**: Dependencies not installed or corrupted

**Solution**:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Generate Prisma client
npm run prisma:generate
```

---

### 🔴 Twilio Phone Number Format

#### Issue: SMS success but not received

**Cause**: Phone number format incorrect

**Solution**:
Phone must include country code:

- ❌ `9876543210` (wrong)
- ✅ `919876543210` or `+919876543210` (correct for India)

Service automatically formats, but ensure format is correct.

---

### 🔴 Email Template Issues

#### Issue: Emails received but formatting looks broken

**Cause**: Email client doesn't support HTML or CSS issue

**Solution**:

1. Test in multiple email clients
2. Check [emailService.js](./src/services/emailService.js) HTML template
3. Simplify CSS if needed (not all CSS supported)
4. Test with plain text alternative

---

### 🔹 Development Tips

#### Enable Request Logging

```bash
NODE_DEBUG=* npm run dev
```

#### Debug JWT Token

```javascript
import { decodeToken } from "./src/utils/jwtUtils.js";

const token = "your_jwt_token";
console.log(decodeToken(token)); // View payload
```

#### Test Email Service Separately

```javascript
import { sendOTPEmail } from "./src/services/emailService.js";

await sendOTPEmail("test@example.com", "123456", "Test User");
```

#### Check Database Queries

Use Prisma Studio:

```bash
npx prisma studio
```

Opens browser UI to view and edit database

---

### 🆘 Still Having Issues?

1. **Check logs** carefully
2. **Verify ALL environment variables** in .env
3. **Ensure database is running** and accessible
4. **Check firewall** and network settings
5. **Review API endpoint** request format
6. **Test with cURL or Postman** before frontend

---

### Debug Output Examples

#### Enable full debugging

```bash
DEBUG=* npm run dev
```

#### Check Prisma generated types

```bash
npx prisma generate
# Check node_modules/.prisma/client
```

#### Validate .env file

```bash
node -e "require('dotenv').config(); console.log(process.env)"
```

---

**Last Updated**: April 2024  
**Need Help?** Check logs, verify .env, restart server
