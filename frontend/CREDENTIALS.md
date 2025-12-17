# Login Credentials

## Default Test Accounts

The application automatically creates default accounts on first load for testing purposes.

### Admin Account
- **Email:** `admin@pharmastore.pk`
- **Password:** `admin123`
- **Role:** Admin

### User Account
- **Email:** `user@pharmastore.pk`
- **Password:** `user123`
- **Role:** Regular User

## How to Login

1. **For Admin:**
   - Click the "Admin" button in the navigation bar
   - Enter the admin credentials above
   - You'll be redirected to the Admin Dashboard

2. **For User:**
   - Click the "User Login" button in the navigation bar
   - Enter the user credentials above
   - You'll be redirected to the User Dashboard

## Creating New Accounts

You can also create new accounts using the Sign Up forms:

1. **New User Account:**
   - Click "User Login" → "Sign Up"
   - Fill in the registration form
   - Your account will be created and you'll be logged in automatically

2. **New Admin Account:**
   - Click "Admin" → "Sign Up"
   - Fill in the admin registration form
   - Your admin account will be created

## Notes

- All accounts are stored in browser localStorage (for frontend-only mode)
- When connected to a backend API, authentication will use the API instead
- Default accounts are created automatically on first page load
- You can create unlimited accounts for testing

## Security Note

⚠️ **Important:** These are default test credentials. In a production environment:
- Change all default passwords
- Use secure password hashing
- Implement proper authentication with JWT tokens
- Store credentials securely in a database

