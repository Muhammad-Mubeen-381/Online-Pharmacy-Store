# Quick Email Setup Guide

## Problem: Emails Not Sending

If users are not receiving emails, it's because the `.env` file is missing or doesn't have the email configuration.

## Solution: Create .env File

### Step 1: Create the .env file

1. Navigate to the `backend` folder
2. Create a new file named `.env` (with the dot at the beginning)
3. Add the following content:

```env
# Database Configuration (use your existing values)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pharmacy_store

# JWT Secret (use your existing value)
JWT_SECRET=your_jwt_secret_key_here

# Server Port
PORT=3000

# Email Configuration - ADD THESE LINES
EMAIL_USER=muhammadmubeenasghar381@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here
```

### Step 2: Get Gmail App Password

**IMPORTANT**: You cannot use your regular Gmail password. You need an App Password.

1. Go to: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Enable **2-Step Verification** (if not already enabled)
4. Go back to Security, scroll down to **"App passwords"**
5. Click **"App passwords"**
6. Select:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **PharmaStore**
7. Click **Generate**
8. Copy the 16-character password (it looks like: `abcd efgh ijkl mnop`)
9. **Remove all spaces** and paste it in your `.env` file

Example:
```env
EMAIL_PASSWORD=abcdefghijklmnop
```

### Step 3: Restart Your Server

After creating/updating the `.env` file:

1. Stop your backend server (Ctrl+C)
2. Start it again: `npm start` or `npm run dev`

### Step 4: Test

1. **Test Signup**: Create a new user account
2. **Test Order**: Place an order
3. **Check Console**: Look for email logs in your server console:
   - ✅ `Email sent successfully!` = Working
   - ❌ `EMAIL_PASSWORD not found` = .env file issue
   - ❌ `Authentication failed` = Wrong password

## Troubleshooting

### Still not working?

1. **Check .env file location**: Must be in `backend/.env` (not `backend/backend/.env`)
2. **Check password format**: No spaces, exactly 16 characters
3. **Check server restart**: Did you restart after creating .env?
4. **Check console logs**: Look for email-related messages when signing up or ordering

### Common Errors

- **"EMAIL_PASSWORD not found"**: .env file doesn't exist or EMAIL_PASSWORD line is missing
- **"EAUTH" or "Authentication failed"**: Wrong app password or 2-step verification not enabled
- **"Less secure app"**: Use App Password instead, don't enable less secure apps

## Quick Check

Run this in your backend folder to verify:
```bash
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET'); console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'NOT SET');"
```

If both show "Set", your configuration is correct!

