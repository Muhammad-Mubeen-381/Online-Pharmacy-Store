# Complete .env File Setup

## ⚠️ Server Error Fix

Your server is failing because the `.env` file is missing the database password.

## ✅ Quick Fix (2 minutes)

### Step 1: Create .env File

1. **Go to**: `Pharmacy_Store/backend/` folder
2. **Create a new file** named: `.env` (with the dot at the beginning!)
3. **Open it** in Notepad or any text editor
4. **Copy and paste** this EXACT content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Mubeen@381
DB_NAME=pharmacy_store
DB_PORT=3306

# JWT Secret (for authentication tokens)
JWT_SECRET=pharmacy_store_jwt_secret_key_2025

# Server Port
PORT=3000

# Email Configuration
EMAIL_USER=pharmacare381@gmail.com
EMAIL_PASSWORD=medpnudkxqukbgfq
```

5. **Save the file**

### Step 2: Restart Server

1. **Stop your server** (press Ctrl+C)
2. **Start again**:
   ```bash
   cd backend
   npm start
   ```
   OR
   ```bash
   npm run dev
   ```

### Step 3: Verify

You should see:
```
✅ Database connected successfully!
🚀 Server running on http://localhost:3000
```

## 📋 What's Included

✅ **Database Configuration**:
- Host: localhost
- User: root
- Password: Mubeen@381
- Database: pharmacy_store
- Port: 3306

✅ **JWT Secret**: For authentication tokens

✅ **Server Port**: 3000

✅ **Email Configuration**:
- Email: pharmacare381@gmail.com
- App Password: medpnudkxqukbgfq

## ⚠️ Important Notes

1. **File name**: Must be `.env` (with the dot!)
2. **File location**: Must be in `backend/.env` (not `backend/backend/.env`)
3. **No spaces**: Make sure there are no extra spaces around the `=` signs
4. **No quotes**: Don't add quotes around values (except in comments)

## 🆘 Still Getting Errors?

### Database Connection Error?

1. **Check MySQL is running**:
   - Open MySQL Workbench
   - Try to connect with: root / Mubeen@381

2. **Verify database exists**:
   - Run: `SHOW DATABASES;`
   - Should see: `pharmacy_store`

3. **Check .env file**:
   - Make sure `DB_PASSWORD=Mubeen@381` is correct
   - No extra spaces or quotes

### Server Still Not Starting?

1. **Check .env file location**: `backend/.env`
2. **Verify file name**: `.env` (not `env` or `.env.txt`)
3. **Restart server** after creating/updating .env
4. **Check console** for specific error messages

## ✅ Success Indicators

When everything is working:
```
✅ Database connected successfully!
🚀 Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api
```

## 📝 Alternative: Use Setup Script

You can also run:
```bash
cd backend
node create-complete-env.js
```

This will create the .env file automatically.

---

**After creating the .env file, your server should start without errors!**

