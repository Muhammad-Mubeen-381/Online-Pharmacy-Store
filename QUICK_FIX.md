# Quick Fix - App Password Setup

## ✅ Your App Password

**App Password**: `medp nudk xquk bgfq`  
**Use this** (remove spaces): `medpnudkxqukbgfq`

## 📝 Manual Setup (2 minutes)

### Step 1: Create .env File

1. Open your file explorer
2. Go to: `Pharmacy_Store/backend/` folder
3. Create a new file named: `.env` (with the dot!)
4. Open it in Notepad or any text editor
5. Copy and paste this EXACTLY:

```
EMAIL_USER=pharmacare381@gmail.com
EMAIL_PASSWORD=medpnudkxqukbgfq
```

6. **Save the file**

### Step 2: Restart Server

1. Stop your backend server (press Ctrl+C)
2. Start it again:
   ```bash
   npm start
   ```
   OR
   ```bash
   npm run dev
   ```

### Step 3: Test

Run this command:
```bash
cd backend
node test-email.js
```

**Success looks like**:
```
✅ SMTP connection verified - Authentication successful!
✅ Email sent successfully!
```

## ⚠️ If Still Failing

1. **Verify App Password**:
   - Make sure it's exactly: `medpnudkxqukbgfq` (16 characters, no spaces)
   - Check the .env file has no extra spaces or quotes

2. **Check .env file location**:
   - Must be: `backend/.env` (not `backend/backend/.env`)
   - File name must start with a dot: `.env`

3. **Verify Gmail account**:
   - Sign in to https://mail.google.com with pharmacare381@gmail.com
   - Make sure 2-Step Verification is enabled
   - Check that the App Password was generated for this account

4. **Restart server** after creating/updating .env

## 📧 What Happens After Setup

Once working:
- ✅ Welcome emails sent automatically when users sign up
- ✅ Order confirmation emails sent automatically when orders placed
- ✅ All emails mention 24-hour delivery

No code changes needed - just the .env file setup!

