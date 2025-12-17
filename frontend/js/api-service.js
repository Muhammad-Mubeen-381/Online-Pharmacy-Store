// API Service Layer - Connects to Backend Tables
// This service handles all API calls to backend endpoints

const API_BASE_URL = 'http://localhost:3000/api'; // Update with your backend URL

class ApiService {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.userType = localStorage.getItem('userType'); // 'user' or 'admin'
    }

    // Set authentication token
    setAuthToken(token, userType) {
        this.token = token;
        this.userType = userType;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userType', userType);
    }

    // Clear authentication
    clearAuth() {
        this.token = null;
        this.userType = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
    }

    // Generic request method with timeout
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers,
            },
        };

        // Add timeout to prevent long delays (increased for database operations)
        const timeout = 10000; // 10 seconds for database operations
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        config.signal = controller.signal;

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==================== AUTHENTICATION ====================
    
    // User Authentication
    async userLogin(email, password) {
        return this.request('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async userSignup(userData) {
        return this.request('/auth/user/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Admin Authentication
    async adminLogin(email, password) {
        return this.request('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async adminSignup(adminData) {
        return this.request('/auth/admin/signup', {
            method: 'POST',
            body: JSON.stringify(adminData),
        });
    }

    // ==================== USERS TABLE ====================
    
    async getUsers() {
        return this.request('/users');
    }

    async getUserById(userId) {
        return this.request(`/users/${userId}`);
    }

    async updateUser(userId, userData) {
        return this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(userId) {
        return this.request(`/users/${userId}`, {
            method: 'DELETE',
        });
    }

    async getCurrentUser() {
        return this.request('/users/me');
    }

    async changePassword(currentPassword, newPassword) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    }

    // ==================== ADMINS TABLE ====================
    
    async getAdmins() {
        return this.request('/admins');
    }

    async getAdminById(adminId) {
        return this.request(`/admins/${adminId}`);
    }

    async updateAdmin(adminId, adminData) {
        return this.request(`/admins/${adminId}`, {
            method: 'PUT',
            body: JSON.stringify(adminData),
        });
    }

    // ==================== MEDICINES TABLE ====================
    
    async getMedicines(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`/medicines?${queryParams}`);
    }

    async getMedicineById(medicineId) {
        return this.request(`/medicines/${medicineId}`);
    }

    async createMedicine(medicineData) {
        return this.request('/medicines', {
            method: 'POST',
            body: JSON.stringify(medicineData),
        });
    }

    async updateMedicine(medicineId, medicineData) {
        return this.request(`/medicines/${medicineId}`, {
            method: 'PUT',
            body: JSON.stringify(medicineData),
        });
    }

    async deleteMedicine(medicineId) {
        return this.request(`/medicines/${medicineId}`, {
            method: 'DELETE',
        });
    }

    // ==================== CATEGORIES TABLE ====================
    
    async getCategories() {
        return this.request('/categories');
    }

    async getCategoryById(categoryId) {
        return this.request(`/categories/${categoryId}`);
    }

    async createCategory(categoryData) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async updateCategory(categoryId, categoryData) {
        return this.request(`/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    }

    async deleteCategory(categoryId) {
        return this.request(`/categories/${categoryId}`, {
            method: 'DELETE',
        });
    }

    // ==================== ORDERS TABLE ====================
    
    async getOrders(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`/orders?${queryParams}`);
    }

    async getOrderById(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async updateOrderStatus(orderId, status) {
        return this.request(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async getUserOrders() {
        return this.request('/orders/my-orders');
    }

    // ==================== ORDER_ITEMS TABLE ====================
    
    async getOrderItems(orderId) {
        return this.request(`/orders/${orderId}/items`);
    }

    // ==================== CART TABLE ====================
    
    async getCart() {
        return this.request('/cart');
    }

    async addToCart(itemData) {
        return this.request('/cart', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    }

    async updateCartItem(itemId, quantity) {
        return this.request(`/cart/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    }

    async removeFromCart(itemId) {
        return this.request(`/cart/${itemId}`, {
            method: 'DELETE',
        });
    }

    async clearCart() {
        return this.request('/cart', {
            method: 'DELETE',
        });
    }

    // ==================== ADDRESSES TABLE ====================
    
    async getAddresses() {
        return this.request('/addresses');
    }

    async getAddressById(addressId) {
        return this.request(`/addresses/${addressId}`);
    }

    async createAddress(addressData) {
        return this.request('/addresses', {
            method: 'POST',
            body: JSON.stringify(addressData),
        });
    }

    async updateAddress(addressId, addressData) {
        return this.request(`/addresses/${addressId}`, {
            method: 'PUT',
            body: JSON.stringify(addressData),
        });
    }

    async deleteAddress(addressId) {
        return this.request(`/addresses/${addressId}`, {
            method: 'DELETE',
        });
    }

    async setDefaultAddress(addressId) {
        return this.request(`/addresses/${addressId}/set-default`, {
            method: 'PUT',
        });
    }

    // ==================== REVIEWS TABLE ====================
    
    async getReviews(medicineId) {
        return this.request(`/reviews?medicineId=${medicineId}`);
    }

    async createReview(reviewData) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }

    async updateReview(reviewId, reviewData) {
        return this.request(`/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData),
        });
    }

    async deleteReview(reviewId) {
        return this.request(`/reviews/${reviewId}`, {
            method: 'DELETE',
        });
    }

    // ==================== INVENTORY TABLE ====================
    
    async getInventory(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`/inventory?${queryParams}`);
    }

    async updateInventory(medicineId, inventoryData) {
        return this.request(`/inventory/${medicineId}`, {
            method: 'PUT',
            body: JSON.stringify(inventoryData),
        });
    }

    async getLowStockItems() {
        return this.request('/inventory/low-stock');
    }

    // ==================== PAYMENTS TABLE ====================
    
    async createPayment(paymentData) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    }

    async getPaymentById(paymentId) {
        return this.request(`/payments/${paymentId}`);
    }

    async getOrderPayments(orderId) {
        return this.request(`/payments?orderId=${orderId}`);
    }

    // ==================== NOTIFICATIONS TABLE ====================
    
    async getNotifications() {
        return this.request('/notifications');
    }

    async markNotificationAsRead(notificationId) {
        return this.request(`/notifications/${notificationId}/read`, {
            method: 'PUT',
        });
    }

    async markAllNotificationsAsRead() {
        return this.request('/notifications/read-all', {
            method: 'PUT',
        });
    }

    // ==================== ANALYTICS & STATS ====================
    
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    async getSalesReport(startDate, endDate) {
        return this.request(`/reports/sales?startDate=${startDate}&endDate=${endDate}`);
    }

    async getTopSellingMedicines(limit = 10) {
        return this.request(`/reports/top-medicines?limit=${limit}`);
    }
}

// Create singleton instance
const apiService = new ApiService();

