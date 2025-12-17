# Email Setup for pharmacare381@gmail.com

## ✅ What I've Done

I've updated the system to use:
- **Email**: pharmacare381@gmail.com  
- **Password**: Pharmacy381#

The code is now configured with these credentials.

---

## ⚠️ Current Status: Authentication Required

**Test Result**: Gmail is rejecting the regular password (`Pharmacy381#`)

**Error**: `535-5.7.8 Username and Password not accepted`

**Reason**: Gmail requires an **App Password** instead of your regular password for SMTP access.

---

## 🔧 Required Gmail Settings

You need to configure the **pharmacare381@gmail.com** account with one of these options:

### Option 1: Use App Password (Recommended - Most Secure)

**Steps**:

1. **Sign in to Gmail**: https://mail.google.com
   - Use: **pharmacare381@gmail.com**
   - Password: **Pharmacy381#**

2. **Enable 2-Step Verification**:
   - Go to: https://myaccount.google.com/security
   - Click **"2-Step Verification"**
   - Follow the setup (phone verification required)
   - Complete the process

3. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Security → App passwords
   - Select:
     - **App**: Mail
     - **Device**: Other (Custom name)
     - **Name**: PharmaStore
   - Click **"Generate"**
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
   - **Remove all spaces**

4. **Update .env file**:
   - Open: `backend/.env`
   - Find: `EMAIL_PASSWORD=Pharmacy381#`
   - Replace with: `EMAIL_PASSWORD=your_16_char_app_password`
   - Save the file

5. **Restart your server** and test:
   ```bash
   cd backend
   node test-email.js
   ```

---

### Option 2: Enable Less Secure Apps (If 2-Step is NOT enabled)

**Note**: Google is phasing this out, but you can try:

1. **Sign in to Gmail**: https://mail.google.com
   - Use: **pharmacare381@gmail.com**

2. **Enable Less Secure Apps**:
   - Go to: https://myaccount.google.com/lesssecureapps
   - Turn **ON** "Allow less secure apps"
   - Wait 2-3 minutes

3. **Test again**:
   ```bash
   cd backend
   node test-email.js
   ```

**If this doesn't work**, you must use Option 1 (App Password).

---

## 📋 Quick Checklist

Before testing, make sure:

- [ ] You can sign in to **pharmacare381@gmail.com** normally in a browser
- [ ] Account is active and not locked
- [ ] 2-Step Verification is enabled (for App Password method)
- [ ] App Password generated (16 characters, no spaces)
- [ ] `.env` file updated with App Password
- [ ] Server restarted after updating `.env`
- [ ] Test email script run successfully

---

## 🧪 Testing

After setting up App Password, test with:

```bash
cd backend
node test-email.js
```

**Success looks like**:
```
✅ SMTP connection verified - Authentication successful!
✅ Email sent successfully!
```

**Failure looks like**:
```
❌ AUTHENTICATION FAILED
Invalid login: 535-5.7.8 Username and Password not accepted
```

---

## 🆘 Troubleshooting

### "App passwords" option not showing?

- **Make sure 2-Step Verification is enabled first**
- Wait a few minutes after enabling 2-Step Verification
- Try refreshing the page
- Direct link: https://myaccount.google.com/apppasswords

### Still getting authentication errors?

1. **Verify App Password**:
   - Make sure there are **no spaces** in the password
   - Should be exactly **16 characters**
   - Copy it fresh from Google (don't type it manually)

2. **Check .env file**:
   - Location: `backend/.env` (not `backend/backend/.env`)
   - Format: `EMAIL_PASSWORD=abcdefghijklmnop` (no quotes, no spaces)

3. **Restart server**:
   - Stop server (Ctrl+C)
   - Start again: `npm start` or `npm run dev`

4. **Verify account**:
   - Sign in to Gmail normally first
   - Check for any security alerts
   - Make sure account is not suspended

---

## 📝 Summary

**Current Status**: 
- ✅ Email changed to: **pharmacare381@gmail.com**
- ✅ Code updated
- ⚠️ **Action Required**: Set up Gmail App Password

**What You Need to Do**:
1. Sign in to **pharmacare381@gmail.com**
2. Enable 2-Step Verification
3. Generate App Password
4. Update `.env` file with App Password
5. Restart server
6. Test

**Once App Password is set up, emails will work perfectly!**

---

## 📧 Email Will Be Sent From

All emails will be sent from:
- **From**: "PharmaStore" <pharmacare381@gmail.com>
- **To**: User's email address (when they sign up or place order)

---

## ✅ After Setup

Once App Password is configured:
- ✅ Welcome emails will send automatically when users sign up
- ✅ Order confirmation emails will send automatically when orders are placed
- ✅ All emails mention 24-hour delivery for orders

No further code changes needed - just the Gmail App Password setup!

