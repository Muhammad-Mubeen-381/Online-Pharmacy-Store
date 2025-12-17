# Email Setup Guide

This guide will help you set up email notifications using Gmail.

## Prerequisites

- A Gmail account (muhammadmubeenasghar381@gmail.com)
- Access to enable "Less secure app access" OR use App Password (recommended)

## Setup Steps

### Option 1: Using App Password (Recommended - More Secure)

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to your Google Account: https://myaccount.google.com/
   - Click on "Security" in the left sidebar
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the prompts to enable it

2. **Generate App Password**:
   - Go back to "Security" settings
   - Under "Signing in to Google", click "App passwords"
   - Select "Mail" as the app and "Other (Custom name)" as the device
   - Enter "PharmaStore" as the name
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: xxxx xxxx xxxx xxxx)

3. **Add to .env file**:
   ```env
   EMAIL_USER=muhammadmubeenasghar381@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```
   (Remove spaces from the app password when adding to .env)

### Option 2: Using Less Secure App Access (Not Recommended)

⚠️ **Warning**: This method is less secure and Google may disable it.

1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Add to .env file:
   ```env
   EMAIL_USER=muhammadmubeenasghar381@gmail.com
   EMAIL_PASSWORD=your_gmail_password
   ```

## Environment Variables

Add these to your `.env` file in the `backend` directory:

```env
# Email Configuration
EMAIL_USER=muhammadmubeenasghar381@gmail.com
EMAIL_PASSWORD=your_app_password_here
```

## Testing

After setup, test the email functionality:

1. **Test Signup Email**: Create a new user account - you should receive a welcome email
2. **Test Order Email**: Place an order - you should receive an order confirmation email

## Troubleshooting

### Email not sending?

1. **Check .env file**: Make sure `EMAIL_PASSWORD` is set correctly
2. **Check App Password**: If using App Password, make sure there are no spaces
3. **Check Gmail Settings**: Ensure 2-Step Verification is enabled (for App Password method)
4. **Check Console Logs**: Look for email-related errors in the server console

### Common Errors

- **"Invalid login"**: Check your email and password in .env
- **"Less secure app access"**: Enable it or use App Password instead
- **"Authentication failed"**: Your App Password might be incorrect

## Email Templates

The system sends two types of emails:

1. **Welcome Email**: Sent when a new user signs up
2. **Order Confirmation Email**: Sent when a user places an order (mentions 24-hour delivery)

Both emails are HTML formatted and include the PharmaStore branding.

