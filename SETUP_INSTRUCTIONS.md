# 🚀 How to Run Pharmacy Store on Localhost

## Step-by-Step Setup Guide

### Prerequisites Check
✅ Node.js installed (check: `node --version`)  
✅ MySQL Workbench installed and MySQL server running  
✅ Web browser (Chrome, Firefox, Edge)

---

## STEP 1: Database Setup (MySQL Workbench)

### 1.1 Open MySQL Workbench
- Launch MySQL Workbench
- Connect to your local MySQL server (usually `localhost` or `127.0.0.1`)

### 1.2 Create Database
1. Click on **"File"** → **"Open SQL Script"**
2. Navigate to: `Pharmacy_Store/backend/database/schema.sql`
3. Open the file
4. Click the **"Execute"** button (⚡ lightning icon) or press **F5**
5. Wait for execution to complete (you'll see "Success" messages)

### 1.3 Verify Database
1. In MySQL Workbench, click **"Refresh"** button in the left panel
2. You should see **`pharmacy_store`** database
3. Expand it to see all tables (users, admins, medicines, categories, etc.)

---

## STEP 2: Backend Setup

### 2.1 Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- Or right-click in the `Pharmacy_Store` folder → "Open in Terminal"

### 2.2 Navigate to Backend Folder
```bash
cd backend
```

### 2.3 Install Dependencies
```bash
npm install
```
This will install all required packages (express, mysql2, etc.)
Wait for it to complete (may take 1-2 minutes)

### 2.4 Configure Database Connection
1. Open `backend/.env` file in a text editor
2. Update these values if needed:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=          # Enter your MySQL password here (leave empty if no password)
   DB_NAME=pharmacy_store
   DB_PORT=3306
   PORT=3000
   JWT_SECRET=pharmacy-store-secret-key-2024
   ```
   > **Important**: If your MySQL has a password, enter it in `DB_PASSWORD`

### 2.5 Start Backend Server
```bash
npm start
```

You should see:
```
✅ Database connected successfully!
🚀 Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api
```

**Keep this terminal window open!** The server must keep running.

---

## STEP 3: Frontend Setup

### Option A: Direct File Opening (Simplest)
1. Navigate to: `Pharmacy_Store/frontend/pages/`
2. Double-click `index.html`
3. It will open in your default browser

### Option B: Using Live Server (Recommended - Better for Development)
1. Install **Live Server** extension in VS Code:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search "Live Server"
   - Click Install
2. Right-click on `frontend/pages/index.html`
3. Select **"Open with Live Server"**
4. Browser will open automatically at `http://127.0.0.1:5500/frontend/pages/index.html`

### Option C: Using Python HTTP Server
1. Open a **NEW** terminal/command prompt
2. Navigate to frontend/pages:
   ```bash
   cd frontend/pages
   ```
3. Start server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```
4. Open browser: `http://localhost:8000/index.html`

---

## STEP 4: Test the Application

### 4.1 Verify Backend is Running
- Open browser
- Go to: `http://localhost:3000/health`
- You should see: `{"status":"OK","message":"Pharmacy Store API is running"}`

### 4.2 Create Your First Account
1. In the Pharmacy Store website, click **"Admin"** button
2. Click **"Sign Up"** link
3. Fill the form:
   - Name: Admin User
   - Email: admin@pharmastore.pk
   - Password: admin123
   - Phone: +92 300 1234567
   - Role: Admin
4. Click **"Create Admin Account"**

### 4.3 Or Create User Account
1. Click **"User Login"** button
2. Click **"Sign Up"** link
3. Fill the form and create account

---

## ✅ Success Checklist

- [ ] MySQL database `pharmacy_store` created
- [ ] Backend server running on port 3000
- [ ] Frontend opened in browser
- [ ] Can see the homepage
- [ ] Can create account
- [ ] Can login

---

## 🐛 Troubleshooting

### Problem: "Database connection failed"
**Solution:**
- Check MySQL server is running
- Verify password in `backend/.env` file
- Make sure `pharmacy_store` database exists
- Check MySQL port (default is 3306)

### Problem: "Cannot GET /" or "Cannot connect to API"
**Solution:**
- Make sure backend server is running (check terminal)
- Verify backend is on `http://localhost:3000`
- Check browser console for errors (F12)
- Ensure `API_BASE_URL` in `frontend/js/api-service.js` is `http://localhost:3000/api`

### Problem: "npm install" fails
**Solution:**
- Make sure Node.js is installed: `node --version`
- Try: `npm cache clean --force`
- Then: `npm install` again

### Problem: Port 3000 already in use
**Solution:**
- Change port in `backend/.env`: `PORT=3001`
- Update `frontend/js/api-service.js`: `const API_BASE_URL = 'http://localhost:3001/api';`

### Problem: CORS errors in browser
**Solution:**
- Backend already has CORS enabled
- Make sure backend server is running
- Check API_BASE_URL is correct

---

## 📝 Quick Commands Reference

```bash
# Start backend (from backend folder)
cd backend
npm install      # First time only
npm start         # Start server

# Start frontend (Option C - Python server)
cd frontend/pages
python -m http.server 8000
```

---

## 🎯 What's Running?

When everything is set up:
- **Backend**: `http://localhost:3000` (API server)
- **Frontend**: `http://localhost:8000/index.html` or file:// path (Website)

Both must be running simultaneously!

---

**Need more help?** Check `README.md` for detailed documentation.

