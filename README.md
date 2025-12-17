# 💊 Pharmacy Store Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive full-stack pharmacy management system built with Node.js, Express, MySQL, and vanilla JavaScript. This system provides a complete solution for managing pharmacy operations, including medicine inventory, orders, payments, user management, and administrative controls.

## ✨ Features

### 👥 User Features
- 🔐 **Secure Authentication** - User registration and login with JWT tokens
- 🛍️ **Medicine Browsing** - Browse medicines by category with advanced search and filtering
- 🛒 **Shopping Cart** - Add items to cart, manage quantities, and seamless checkout
- 📦 **Order Management** - View order history, track order status, and order details
- 📍 **Address Management** - Save and manage multiple delivery addresses
- ⭐ **Reviews & Ratings** - Rate and review medicines
- 👤 **User Dashboard** - View statistics, recent orders, and account information
- 💳 **Multiple Payment Methods** - Cash on Delivery, Credit/Debit Card, EasyPaisa, JazzCash
- 📧 **Email Notifications** - Order confirmation emails

### 🔧 Admin Features
- 🎛️ **Admin Dashboard** - Comprehensive analytics and statistics
- 💊 **Medicine Management** - Full CRUD operations for medicines
- 📂 **Category Management** - Create and manage medicine categories
- 📋 **Order Management** - View all orders, update order status, track payments
- 👥 **User Management** - View and manage user accounts
- 📊 **Inventory Management** - Track stock levels, low stock alerts, sales tracking
- 📈 **Analytics & Reports** - Sales reports, top-selling medicines, revenue tracking
- 🔔 **Notifications System** - Send notifications to users

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and gradients
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript
- **Font Awesome** - Icon library
- **Google Fonts (Poppins)** - Typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **Nodemailer** - Email service

### Database
- **MySQL** - Relational database with 12+ tables

## 📁 Project Structure

```
Pharmacy_Store/
├── frontend/
│   ├── pages/              # HTML pages (index, dashboard, admin, etc.)
│   ├── js/                 # JavaScript files
│   │   ├── api-service.js  # API communication
│   │   ├── router.js       # Client-side routing
│   │   └── script.js       # Main application logic
│   └── assets/             # CSS, images, and static assets
├── backend/
│   ├── config/             # Database configuration
│   ├── routes/             # API route handlers
│   │   ├── auth.js         # Authentication routes
│   │   ├── medicines.js     # Medicine management
│   │   ├── orders.js       # Order processing
│   │   ├── payments.js     # Payment handling
│   │   └── ...             # More routes
│   ├── middleware/         # Authentication middleware
│   ├── database/           # SQL schema and seed files
│   │   ├── schema.sql      # Database schema
│   │   └── seed-users.js   # Seed script for default users
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)
- **Web Browser** (Chrome, Firefox, Edge, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pharmacy-store.git
   cd pharmacy-store
   ```

2. **Set up the database**
   - Open MySQL Workbench and connect to your MySQL server
   - Run the schema file: `backend/database/schema.sql`
   - This creates the `pharmacy_store` database and all required tables

3. **Create default user accounts**
   ```bash
   cd backend
   npm run seed
   ```
   This creates default admin and user accounts (see credentials below)

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Configure environment variables**
   - Create a `.env` file in the `backend` folder
   - Copy the template and update with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=pharmacy_store
   DB_PORT=3306
   PORT=3000
   JWT_SECRET=your-secret-key-here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Open the frontend**
   - Navigate to `frontend/pages/`
   - Open `index.html` in your browser
   - Or use a local server (recommended):
     ```bash
     cd frontend/pages
     python -m http.server 8000
     # Then open: http://localhost:8000/index.html
     ```

## 🔐 Default Login Credentials

After running the seed script, you can use these credentials:

### Admin Account
- **Email**: `admin@pharmastore.pk`
- **Password**: `admin123`

### User Account
- **Email**: `user@pharmastore.pk`
- **Password**: `user123`

> ⚠️ **Security Note**: Change these passwords immediately in a production environment!

## 📡 API Endpoints

The backend provides RESTful API endpoints at `http://localhost:3000/api/`

### Authentication
- `POST /api/auth/user/login` - User login
- `POST /api/auth/user/signup` - User signup
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/signup` - Admin signup

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create medicine (Admin)
- `PUT /api/medicines/:id` - Update medicine (Admin)
- `DELETE /api/medicines/:id` - Delete medicine (Admin)

### Orders
- `GET /api/orders` - Get orders (User/Admin)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order (User)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments
- `POST /api/payments` - Create payment record
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments?orderId=:id` - Get payments for an order

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Categories, Addresses, Reviews, Inventory, Dashboard, Reports
See the `backend/routes/` folder for all available endpoints.

## 🗄️ Database Schema

The database includes the following main tables:
- `users` - User accounts
- `admins` - Admin accounts
- `medicines` - Medicine/product catalog
- `categories` - Medicine categories
- `orders` - Order records
- `order_items` - Order line items
- `cart` - Shopping cart items
- `addresses` - User delivery addresses
- `payments` - Payment records
- `reviews` - Medicine reviews and ratings
- `notifications` - User notifications

## 🎯 Key Features in Detail

### Payment System
- Automatic payment record creation when orders are placed
- Support for multiple payment methods (COD, Card, EasyPaisa, JazzCash)
- Transaction ID generation for digital payments
- Payment status tracking (pending/completed/failed)

### Order Management
- Complete order lifecycle management
- Automatic stock deduction on order placement
- Sales tracking and analytics
- Email notifications for order confirmations

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Secure API endpoints with middleware protection

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Ensure `pharmacy_store` database exists
- Check if port 3000 is available

### Frontend can't connect to backend
- Ensure backend server is running on port 3000
- Check browser console for CORS errors
- Verify `API_BASE_URL` in `frontend/js/api-service.js`

### Database connection errors
- Verify MySQL server is running
- Check database credentials in `.env`
- Ensure `pharmacy_store` database exists
- Run `schema.sql` again if tables are missing

### Login credentials not working
- Run the seed script: `npm run seed` in the backend folder
- This will create/update default accounts with proper password hashes

## 📝 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
- Use Live Server extension in VS Code
- Or any static file server

### Project Structure Details

- **Frontend**: Pure HTML/CSS/JS, no build process required
- **Backend**: Express.js REST API with MySQL
- **Database**: MySQL with relational schema

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ for pharmacy management

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- All contributors and users of this project

## 📞 Support

For support, email support@pharmastore.pk or open an issue in the repository.

---

**Made with 💊 for better pharmacy management**
