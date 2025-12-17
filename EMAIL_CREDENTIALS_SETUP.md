# Email Credentials Setup - pharmacare381@gmail.com

## Current Configuration

The system is configured to use:
- **Email**: pharmacare381@gmail.com
- **Password**: Pharmacy381#

## Testing

Run the test script to check if the credentials work:
```bash
cd backend
node test-email.js
```

## Possible Issues & Solutions

### Issue 1: Authentication Failed (EAUTH Error)

**Symptom**: You see error like:
```
❌ AUTHENTICATION FAILED - Gmail Security Issue
Invalid login: 535-5.7.8 Username and Password not accepted
```

**Cause**: Gmail requires App Password when 2-Step Verification is enabled.

**Solution**:

1. **Go to Gmail Account**: https://myaccount.google.com/
2. **Sign in** with pharmacare381@gmail.com
3. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification → Get Started
4. **Generate App Password**:
   - Go to Security → App passwords
   - Select: Mail → Other (Custom name) → "PharmaStore"
   - Click Generate
   - Copy the 16-character password (remove spaces)
5. **Update .env file**:
   ```env
   EMAIL_USER=pharmacare381@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password_here
   ```
6. **Restart server** and test again

---

### Issue 2: "Less Secure App Access" Required

**Symptom**: Error mentions "Less secure app access"

**Solution** (if 2-Step Verification is NOT enabled):

1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Wait a few minutes
4. Test again

**Note**: Google is phasing out this feature. Using App Password (Issue 1) is recommended.

---

### Issue 3: Account Locked or Suspended

**Symptom**: Account access denied or suspicious activity warnings

**Solution**:

1. **Sign in to Gmail** normally first (to verify account is active)
2. **Check for security alerts** in your Gmail inbox
3. **Complete any verification** Google requests
4. **Wait 24 hours** if account was temporarily locked
5. Try again

---

### Issue 4: "Access Blocked" Error

**Symptom**: Error says "Access blocked" or "This app's request is invalid"

**Solution**:

1. **Sign in to Gmail** from a browser first
2. **Check Google Account** for any security warnings
3. **Review recent sign-in activity** to ensure account is secure
4. If using App Password, **regenerate** a new one
5. Make sure you're using the **correct email** (pharmacare381@gmail.com)

---

## Step-by-Step: First Time Setup

### Option A: Try Regular Password First (Easiest)

1. **Make sure account is active**:
   - Sign in to https://mail.google.com with pharmacare381@gmail.com
   - Verify you can access the account normally

2. **Test email sending**:
   ```bash
   cd backend
   node test-email.js
   ```

3. **If it works**: ✅ You're done!

4. **If authentication fails**: Follow Option B below

---

### Option B: Use App Password (Most Reliable)

1. **Sign in to Google Account**: https://myaccount.google.com/
   - Use: pharmacare381@gmail.com

2. **Enable 2-Step Verification**:
   - Go to Security → 2-Step Verification
   - Follow the setup process (phone verification required)

3. **Generate App Password**:
   - Go to Security → App passwords
   - App: Mail
   - Device: Other (Custom name)
   - Name: PharmaStore
   - Generate → Copy the password

4. **Update .env file** in `backend` folder:
   ```env
   EMAIL_USER=pharmacare381@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   (Replace with your actual 16-character App Password, no spaces)

5. **Restart server** and test:
   ```bash
   node test-email.js
   ```

---

## Quick Checklist

- [ ] Can sign in to pharmacare381@gmail.com normally?
- [ ] Account is not locked or suspended?
- [ ] Tested with regular password first?
- [ ] If failed, enabled 2-Step Verification?
- [ ] Generated App Password?
- [ ] Updated .env file with App Password?
- [ ] Restarted server after updating .env?
- [ ] Test email sent successfully?

---

## What to Check in Gmail Account

1. **Account Status**: Make sure pharmacare381@gmail.com is active
2. **Security Settings**: Check Security tab in Google Account
3. **Recent Activity**: Review sign-in history for any issues
4. **App Passwords**: If 2-Step is enabled, App Passwords section should be visible

---

## Still Not Working?

1. **Check console logs** for specific error messages
2. **Verify .env file** is in correct location (`backend/.env`)
3. **Check password** has no extra spaces or characters
4. **Try regenerating** App Password if using one
5. **Wait a few minutes** after changing settings (Gmail needs time to sync)

---

## Success Indicators

When everything is working, you'll see:
```
✅ SMTP connection verified - Authentication successful!
✅ Email sent successfully!
   Message ID: <...>
```

Then check the recipient's inbox (and spam folder) for the email!

