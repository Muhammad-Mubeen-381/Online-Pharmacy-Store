# Quick Email Fix - Using Admin Credentials

## Current Configuration

The system is now configured to use:
- **Email**: muhammadmubeenasghar381@gmail.com
- **Password**: Mubeen@381

## Important: Gmail Security

⚠️ **Gmail may reject the regular password** due to security policies. Here's what to do:

### Option 1: Try It First (Simplest)

1. **Restart your backend server**
2. **Test by creating a user account** or placing an order
3. **Check the console logs** - you'll see if it works or fails

### Option 2: If Authentication Fails (Most Likely)

Gmail requires an **App Password** instead of your regular password when 2-Step Verification is enabled.

#### Quick Steps:

1. **Go to**: https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled)
3. **Go to "App passwords"** (under "Signing in to Google")
4. **Generate new App Password**:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: **PharmaStore**
5. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
6. **Remove spaces** and create/update `.env` file:

```env
EMAIL_USER=muhammadmubeenasghar381@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

7. **Restart server**

### Option 3: Enable Less Secure Apps (Not Recommended)

⚠️ Google is phasing this out, but you can try:

1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Use regular password: `Mubeen@381`

**Note**: This may not work as Google is disabling this feature.

## Test Email

Run this to test:
```bash
cd backend
node test-email.js
```

Or test by:
1. Creating a new user account
2. Placing an order
3. Check console for email logs

## What You'll See

### ✅ If Working:
```
✅ SMTP connection verified - Authentication successful!
✅ Email sent successfully!
```

### ❌ If Failing:
```
❌ AUTHENTICATION FAILED - Gmail Security Issue
❌ Gmail requires App Password, not regular password!
```

## Bottom Line

**Try it first** - restart server and test. If you see authentication errors, you **must** use an App Password (Option 2 above). This is a Gmail security requirement, not a limitation of our code.

