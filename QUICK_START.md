# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Database Setup (2 minutes)

1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Open `backend/database/schema.sql`
4. Execute the entire script (Run button or F5)
5. Verify: You should see `pharmacy_store` database created

### Step 2: Backend Setup (2 minutes)

1. Open terminal/command prompt
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. **Important**: Create `.env` file (copy from `.env.example` if needed):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=pharmacy_store
   DB_PORT=3306
   PORT=3000
   JWT_SECRET=pharmacy-store-secret-key-2024
   ```
   > Replace `your_mysql_password` with your actual MySQL password (leave empty if no password)

5. Start the server:
   ```bash
   npm start
   ```
6. You should see: `🚀 Server running on http://localhost:3000`

### Step 3: Frontend Setup (1 minute)

1. Open `frontend/pages/index.html` in your web browser
   - **Option A**: Double-click the file
   - **Option B**: Use Live Server (VS Code extension)
   - **Option C**: Use Python server:
     ```bash
     cd frontend/pages
     python -m http.server 8000
     # Then open: http://localhost:8000/index.html
     ```

### Step 4: Create Your First Account

1. Click **"Admin"** button in the navigation
2. Click **"Sign Up"** link
3. Fill in the form:
   - Name: Admin User
   - Email: admin@pharmastore.pk
   - Password: admin123
   - Phone: +92 300 1234567
   - Role: Admin
4. Click **"Create Admin Account"**

Or create a user account:
1. Click **"User Login"** button
2. Click **"Sign Up"** link
3. Fill in the form and create account

## ✅ You're All Set!

Now you can:
- Browse medicines
- Add items to cart
- Place orders
- Manage inventory (as admin)
- View analytics (as admin)

## 🔧 Troubleshooting

**Backend won't start?**
- Check MySQL is running
- Verify database credentials in `.env`
- Make sure `pharmacy_store` database exists

**Can't connect to backend?**
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify `API_BASE_URL` in `frontend/js/api-service.js`

**Database errors?**
- Run `schema.sql` again
- Check MySQL server is running
- Verify database credentials

## 📞 Need Help?

Check the main `README.md` for detailed documentation.

---

**Happy Coding! 🎉**

