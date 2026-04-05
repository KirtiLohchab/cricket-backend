# Cricket Backend - Sample API Requests

This file contains sample requests for testing all API endpoints. You can use these with:

- Postman
- Insomnia
- Thunder Client
- REST Client VS Code Extension

---

## 🔵 1. SEND OTP - Email

```
POST http://localhost:3000/api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

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

---

## 🔵 2. SEND OTP - Phone

```
POST http://localhost:3000/api/auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otpId": "clu1a2b3c4d5e6f7",
    "method": "phone",
    "target": "***3210",
    "expiresIn": 10
  }
}
```

---

## 🟢 3. VERIFY OTP - Email

```
POST http://localhost:3000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "userId": "clu1xyz123abc456",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHUxeHl6MTIzYWJjNDU2IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicGhvbmUiOm51bGwsImlhdCI6MTcxMjI4MjQwMCwiZXhwIjoxNzEyODg3MjAwfQ.abc123...",
    "user": {
      "id": "clu1xyz123abc456",
      "email": "user@example.com",
      "phone": null,
      "isNewUser": true
    }
  }
}
```

---

## 🟢 4. VERIFY OTP - Phone

```
POST http://localhost:3000/api/auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "code": "654321"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "userId": "clu1xyz123abc456",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clu1xyz123abc456",
      "email": null,
      "phone": "919876543210",
      "isNewUser": true
    }
  }
}
```

---

## 🟣 5. RESEND OTP

```
POST http://localhost:3000/api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otpId": "clu1a2b3c4d5e6f7"
}
```

**OR**

```
POST http://localhost:3000/api/auth/resend-otp
Content-Type: application/json

{
  "phone": "9876543210"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP resent successfully",
  "data": {
    "otpId": "clu1a2b3c4d5e6f7",
    "method": "email",
    "expiresIn": 10
  }
}
```

---

## 🔴 6. GET STATES

```
GET http://localhost:3000/api/users/states
```

**Response:**

```json
{
  "success": true,
  "message": "States retrieved successfully",
  "data": {
    "states": [
      {
        "id": "state_1",
        "name": "Maharashtra",
        "code": "MH"
      },
      {
        "id": "state_2",
        "name": "Delhi",
        "code": "DL"
      },
      {
        "id": "state_3",
        "name": "Karnataka",
        "code": "KA"
      },
      {
        "id": "state_4",
        "name": "Tamil Nadu",
        "code": "TN"
      },
      {
        "id": "state_5",
        "name": "Uttar Pradesh",
        "code": "UP"
      }
    ]
  }
}
```

---

## 🟠 7. GET DISTRICTS BY STATE

Replace `state_1` with actual state ID from step 6.

```
GET http://localhost:3000/api/users/districts/state_1
```

**Response:**

```json
{
  "success": true,
  "message": "Districts retrieved successfully",
  "data": {
    "districts": [
      {
        "id": "district_1",
        "name": "Mumbai",
        "code": null
      },
      {
        "id": "district_2",
        "name": "Pune",
        "code": null
      },
      {
        "id": "district_3",
        "name": "Nagpur",
        "code": null
      },
      {
        "id": "district_4",
        "name": "Thane",
        "code": null
      }
    ]
  }
}
```

---

## 🟦 8. REGISTER PLAYER

Replace `YOUR_JWT_TOKEN` with token from step 3 or 4.
Replace state and district IDs with actual IDs from steps 6 and 7.

```
POST http://localhost:3000/api/users/register
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "fatherName": "Ramesh Kumar",
  "motherName": "Lakshmi",
  "dateOfBirth": "2005-06-15",
  "ageCategory": "UNDER_16",
  "stateId": "state_1",
  "districtId": "district_1",
  "city": "Mumbai",
  "playerRole": "BATSMAN",
  "trialStateId": "state_1",
  "trialDistrictId": "district_2"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Player registered successfully",
  "data": {
    "playerProfile": {
      "id": "profile_1",
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

---

## 🟪 9. GET USER PROFILE

Replace `YOUR_JWT_TOKEN` with your JWT token.

```
GET http://localhost:3000/api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "userId": "clu1xyz123abc456",
    "email": "user@example.com",
    "phone": "919876543210",
    "isEmailVerified": true,
    "isPhoneVerified": true,
    "createdAt": "2024-04-05T10:00:00.000Z",
    "playerProfile": {
      "id": "profile_1",
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "fatherName": "Ramesh Kumar",
      "motherName": "Lakshmi",
      "dateOfBirth": "2005-06-15T00:00:00.000Z",
      "age": 18,
      "ageCategory": "UNDER_16",
      "state": "Maharashtra",
      "stateId": "state_1",
      "district": "Mumbai",
      "districtId": "district_1",
      "city": "Mumbai",
      "playerRole": "BATSMAN",
      "trialState": "Maharashtra",
      "trialStateId": "state_1",
      "trialDistrict": "Pune",
      "trialDistrictId": "district_2",
      "createdAt": "2024-04-05T10:30:00.000Z",
      "updatedAt": "2024-04-05T10:30:00.000Z"
    }
  }
}
```

---

## 🟫 10. UPDATE PLAYER PROFILE

Replace `YOUR_JWT_TOKEN` and IDs with actual values.

```
PUT http://localhost:3000/api/users/profile
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "city": "Bangalore",
  "playerRole": "ALL_ROUNDER",
  "districtId": "district_5",
  "stateId": "state_3"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Player profile updated successfully",
  "data": {
    "playerProfile": {
      "id": "profile_1",
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "fatherName": "Ramesh Kumar",
      "motherName": "Lakshmi",
      "dateOfBirth": "2005-06-15T00:00:00.000Z",
      "age": 18,
      "ageCategory": "UNDER_16",
      "state": "Karnataka",
      "stateId": "state_3",
      "district": "Bangalore",
      "districtId": "district_5",
      "city": "Bangalore",
      "playerRole": "ALL_ROUNDER",
      "trialState": "Maharashtra",
      "trialStateId": "state_1",
      "trialDistrict": "Pune",
      "trialDistrictId": "district_2",
      "createdAt": "2024-04-05T10:30:00.000Z",
      "updatedAt": "2024-04-05T11:00:00.000Z"
    }
  }
}
```

---

## 🔘 11. LOGOUT

Replace `YOUR_JWT_TOKEN` with your JWT token.

```
POST http://localhost:3000/api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🧪 Testing Sequence

Follow this sequence to test the complete flow:

1. **Test OTP Send** (Step 1 or 2)
2. **Test OTP Verify** (Step 3 or 4) - Get JWT token
3. **Get States** (Step 6)
4. **Get Districts** (Step 7) - Get state ID from step 3
5. **Register Player** (Step 8) - Use JWT token and IDs
6. **Get Profile** (Step 9) - Verify registration
7. **Update Profile** (Step 10)
8. **Logout** (Step 11)

---

## 📋 REST Client Extension Format

If using VS Code REST Client extension, save as `requests.http`:

```http
### Send OTP to Email
POST http://localhost:3000/api/auth/send-otp HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com"
}

###

### Verify OTP
POST http://localhost:3000/api/auth/verify-otp HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}

###

### Get States
GET http://localhost:3000/api/users/states HTTP/1.1
```

---

## 📌 Notes for Testing

1. **Save JWT Token**: Save the token from verify-otp response
2. **Use Correct IDs**: Always use IDs returned from API responses
3. **Phone Format**: Phone numbers should be 10 digits without country code
4. **Date Format**: Use YYYY-MM-DD for dates
5. **Rate Limiting**: Wait between requests if you hit rate limits
6. **OTP Expiry**: OTP expires in 10 minutes (configurable)

---

**Last Updated**: April 2024
