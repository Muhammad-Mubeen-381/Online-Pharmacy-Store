# PharmaStore - Premium Pharmacy Management System

A full-featured, modern pharmacy management system with separate user and admin interfaces, designed to connect with a comprehensive backend database.

## 🚀 Features

### User Features
- **User Authentication**: Secure login and signup system
- **Medicine Browsing**: Browse medicines by category with advanced search and filtering
- **Shopping Cart**: Add items to cart, manage quantities, and checkout
- **Order Management**: View order history and track order status
- **User Dashboard**: View statistics, recent orders, and account information
- **Address Management**: Manage delivery addresses
- **Reviews & Ratings**: Rate and review medicines

### Admin Features
- **Admin Authentication**: Separate admin login and signup
- **Admin Dashboard**: Comprehensive analytics and statistics
- **Medicine Management**: Add, edit, delete, and manage medicines
- **Order Management**: View and manage all orders, update order status
- **User Management**: View and manage user accounts
- **Category Management**: Create and manage medicine categories
- **Inventory Management**: Track stock levels and low stock alerts
- **Analytics**: Sales reports, top-selling medicines, revenue tracking

## 🗄️ Backend Database Tables

This frontend is designed to connect with the following backend tables:

### 1. **users**
- Stores user account information
- Fields: id, name, email, password, phone, address, createdAt, updatedAt

### 2. **admins**
- Stores admin account information
- Fields: id, name, email, password, phone, role, createdAt, updatedAt

### 3. **medicines**
- Stores medicine/product information
- Fields: id, name, description, price, image, categoryId, stock, sales, rating, createdAt, updatedAt

### 4. **categories**
- Stores medicine categories
- Fields: id, name, description, icon, createdAt, updatedAt

### 5. **orders**
- Stores order information
- Fields: id, userId, total, status, shippingAddress, paymentStatus, createdAt, updatedAt

### 6. **order_items**
- Stores individual items in each order
- Fields: id, orderId, medicineId, quantity, price, subtotal

### 7. **cart**
- Stores user shopping cart items
- Fields: id, userId, medicineId, quantity, createdAt, updatedAt

### 8. **addresses**
- Stores user delivery addresses
- Fields: id, userId, street, city, state, zipCode, country, isDefault, createdAt, updatedAt

### 9. **reviews**
- Stores user reviews for medicines
- Fields: id, userId, medicineId, rating, comment, createdAt, updatedAt

### 10. **inventory**
- Stores inventory/stock information
- Fields: id, medicineId, quantity, lowStockThreshold, lastRestocked, updatedAt

### 11. **payments**
- Stores payment transaction information
- Fields: id, orderId, amount, paymentMethod, status, transactionId, createdAt

### 12. **notifications**
- Stores user/admin notifications
- Fields: id, userId, adminId, type, message, isRead, createdAt

## 📁 Project Structure

```
├── index.html          # Main HTML file with all pages
├── styles.css          # Comprehensive styling
├── script.js           # Main application logic
├── router.js           # SPA routing system
├── api-service.js      # API service layer for backend communication
└── README.md           # This file
```

## 🔌 API Integration

The application uses a centralized API service (`api-service.js`) that handles all backend communication. The API base URL is configurable:

```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // Update with your backend URL
```

### API Endpoints Structure

All API calls follow RESTful conventions:

- **Authentication**: `/auth/user/login`, `/auth/user/signup`, `/auth/admin/login`, `/auth/admin/signup`
- **Users**: `/users`, `/users/:id`, `/users/me`
- **Admins**: `/admins`, `/admins/:id`
- **Medicines**: `/medicines`, `/medicines/:id`
- **Categories**: `/categories`, `/categories/:id`
- **Orders**: `/orders`, `/orders/:id`, `/orders/my-orders`
- **Cart**: `/cart`, `/cart/:id`
- **Addresses**: `/addresses`, `/addresses/:id`
- **Reviews**: `/reviews`, `/reviews/:id`
- **Inventory**: `/inventory`, `/inventory/:id`
- **Payments**: `/payments`, `/payments/:id`
- **Notifications**: `/notifications`, `/notifications/:id`
- **Analytics**: `/dashboard/stats`, `/reports/sales`, `/reports/top-medicines`

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Gradient Backgrounds**: Beautiful gradient color schemes
- **Smooth Animations**: CSS animations and transitions throughout
- **Loading States**: Loading overlays for better UX
- **Notifications**: Toast notifications for user feedback
- **Modal Dialogs**: Beautiful modal dialogs for forms and information

## 🚦 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a web browser
3. **Configure API URL** in `api-service.js` to point to your backend
4. **Start using** the application!

### For Development

1. Set up a local web server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. Open `http://localhost:8000` in your browser

## 🔐 Authentication

The application supports two types of authentication:

1. **User Authentication**: Regular users can sign up and login to access user features
2. **Admin Authentication**: Admins have separate login/signup to access admin panel

Authentication tokens are stored in localStorage and sent with API requests via the Authorization header.

## 📱 Pages & Routes

- `/` - Home page with popular medicines
- `/medicines` - Browse all medicines
- `/dashboard` - User dashboard (requires login)
- `/admin/dashboard` - Admin dashboard (requires admin login)
- `/orders` - User order history
- `/addresses` - Manage delivery addresses
- `/profile` - User profile management
- `/admin/medicines` - Admin medicine management
- `/admin/orders` - Admin order management
- `/admin/users` - Admin user management
- `/admin/categories` - Category management
- `/admin/inventory` - Inventory management
- `/admin/analytics` - Analytics and reports

## 🛠️ Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... */
}
```

### Adding New Features

1. Add new API methods in `api-service.js`
2. Create UI components in `script.js`
3. Add routes in `router.js`
4. Style components in `styles.css`

## 📝 Notes

- The application includes fallback local data if the API is unavailable
- All forms include client-side validation
- The application uses localStorage for cart persistence (when not logged in)
- Error handling is implemented throughout the application

## 🔄 Backend Requirements

Your backend should implement:

1. RESTful API endpoints matching the structure in `api-service.js`
2. JWT token-based authentication
3. CORS enabled for frontend domain
4. Database with the 12 tables mentioned above
5. Proper error handling and status codes

## 📄 License

This project is open source and available for use and modification.

## 👨‍💻 Development

Built with:
- Vanilla JavaScript (ES6+)
- Modern CSS3 with CSS Variables
- Font Awesome Icons
- Google Fonts (Poppins)

---

**Note**: This is a frontend-only application. You need to implement the backend API endpoints to make it fully functional.

