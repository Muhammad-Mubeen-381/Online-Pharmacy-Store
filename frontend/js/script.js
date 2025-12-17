// Application State
let currentUser = null;
let currentAdmin = null;
let medicines = [];
let categories = [];
let cart = [];
let orders = [];

// DOM Elements
const mainContent = document.getElementById('mainContent');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not already initialized on this page
    if (typeof initializeApp === 'function') {
        initializeApp();
    }
    if (typeof setupEventListeners === 'function') {
        setupEventListeners();
    }
    // Only setup routing if router exists (for SPA pages)
    if (typeof router !== 'undefined' && typeof setupRouting === 'function') {
        setupRouting();
    }
    if (typeof checkAuth === 'function') {
        checkAuth();
    }
});

// Initialize App - Optimized for fast loading
async function initializeApp() {
    // Load current user/admin from token (stored in localStorage for auth only)
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('authToken');
    
    if (token && userType === 'user' && typeof apiService !== 'undefined') {
        try {
            const userData = await apiService.getCurrentUser();
            currentUser = userData.user || userData;
        } catch (error) {
            console.log('Could not load user data');
        }
    }
    
    if (token && userType === 'admin' && typeof apiService !== 'undefined') {
        try {
            // Admin data is stored in token, we'll get it from auth
            const storedAdmin = localStorage.getItem('currentAdmin');
            if (storedAdmin) {
                currentAdmin = JSON.parse(storedAdmin);
            }
        } catch (error) {
            console.log('Could not load admin data');
        }
    }
    
    // Load cart from database
    await loadCart();
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    // Load medicines and categories from database
    try {
        await Promise.all([
            loadMedicines(),
            loadCategories()
        ]);
    } catch (error) {
        console.error('Failed to load data from database:', error);
    }
    
    // Populate category filter
    if (typeof populateCategoryFilter === 'function') {
        populateCategoryFilter();
    }
}

// Removed localStorage-based data loading - now using database only

// Setup Routing
function setupRouting() {
    // Home route
    router.route('/', () => {
        showPage('homePage');
        displayPopularMedicines();
    });

    // Medicines route
    router.route('/medicines', () => {
        showPage('medicinesPage');
        displayMedicines();
    });

    // User Dashboard
    router.route('/dashboard', () => {
        if (!currentUser) {
            showNotification('Please login to access dashboard', 'error');
            router.navigate('/');
            openModal(document.getElementById('userLoginModal'));
            return;
        }
        showPage('userDashboardPage');
        loadUserDashboard();
    });

    // Admin Dashboard
    router.route('/admin/dashboard', () => {
        if (!currentAdmin) {
            showNotification('Please login as admin', 'error');
            router.navigate('/');
            openModal(document.getElementById('adminLoginModal'));
            return;
        }
        showPage('adminDashboardPage');
        loadAdminDashboard();
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || '/';
        router.handleRoute();
    });

    // Initialize route
    router.handleRoute();
}

// Show Page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = 'block';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation links - don't prevent default for regular links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default for hash links if router exists
            if (typeof router !== 'undefined') {
                e.preventDefault();
                const route = link.getAttribute('data-route') || link.getAttribute('href').slice(1);
                router.navigate(route);
            }
        });
    });

    // User Login/Signup
    const userLoginBtn = document.getElementById('userLoginBtn');
    const userSignupBtn = document.getElementById('userSignupBtn');
    const userLoginForm = document.getElementById('userLoginForm');
    const userSignupForm = document.getElementById('userSignupForm');
    const switchToUserSignup = document.getElementById('switchToUserSignup');
    const switchToUserLogin = document.getElementById('switchToUserLogin');
    
    if (userLoginBtn) {
        userLoginBtn.addEventListener('click', () => {
            const modal = document.getElementById('userLoginModal');
            if (modal) openModal(modal);
        });
    }
    if (userSignupBtn) {
        userSignupBtn.addEventListener('click', () => {
            const modal = document.getElementById('userSignupModal');
            if (modal) openModal(modal);
        });
    }
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', handleUserLogin);
    }
    if (userSignupForm) {
        userSignupForm.addEventListener('submit', handleUserSignup);
    }
    if (switchToUserSignup) {
        switchToUserSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(document.getElementById('userLoginModal'));
            openModal(document.getElementById('userSignupModal'));
        });
    }
    if (switchToUserLogin) {
        switchToUserLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(document.getElementById('userSignupModal'));
            openModal(document.getElementById('userLoginModal'));
        });
    }

    // Admin Login/Signup
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminSignupForm = document.getElementById('adminSignupForm');
    const switchToAdminSignup = document.getElementById('switchToAdminSignup');
    const switchToAdminLogin = document.getElementById('switchToAdminLogin');
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const modal = document.getElementById('adminLoginModal');
            if (modal) openModal(modal);
        });
    }
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    if (adminSignupForm) {
        adminSignupForm.addEventListener('submit', handleAdminSignup);
    }
    if (switchToAdminSignup) {
        switchToAdminSignup.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(document.getElementById('adminLoginModal'));
            openModal(document.getElementById('adminSignupModal'));
        });
    }
    if (switchToAdminLogin) {
        switchToAdminLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(document.getElementById('adminSignupModal'));
            openModal(document.getElementById('adminLoginModal'));
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleUserLogout);
    }
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', handleAdminLogout);
    }

    // Cart
    const cartBtn = document.getElementById('cartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Search and filters
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }

    // User dropdown
    const userProfileBtn = document.getElementById('userProfileBtn');
    const adminProfileBtn = document.getElementById('adminProfileBtn');
    
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', toggleUserDropdown);
    }
    if (adminProfileBtn) {
        adminProfileBtn.addEventListener('click', toggleAdminDropdown);
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            document.querySelectorAll('.user-dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Authentication Functions
async function handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('userLoginEmail').value;
    const password = document.getElementById('userLoginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    
    // Show button loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    }
    
    try {
        // Connect directly to backend API
        if (typeof apiService !== 'undefined') {
            const response = await apiService.userLogin(email, password);
            
            // Store token and user info
            if (response.token) {
                apiService.setAuthToken(response.token, 'user');
                currentUser = response.user || { name: response.name, email: response.email, phone: response.phone };
                // Only store minimal user info for display, not for data storage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('userType', 'user');
                
                checkAuth();
                closeModal(document.getElementById('userLoginModal'));
                if (typeof showNotification === 'function') {
                    showNotification('Login successful!', 'success');
                }
                document.getElementById('userLoginForm').reset();
                
                // Navigate to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } else {
            throw new Error('API service not available');
        }
    } catch (error) {
        // Restore button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        
        // Show error message
        if (typeof showNotification === 'function') {
            showNotification(error.message || 'Invalid email or password', 'error');
        } else {
            alert(error.message || 'Invalid email or password');
        }
        console.error('Login error:', error);
    }
}

async function handleUserSignup(e) {
    e.preventDefault();
    const userData = {
        name: document.getElementById('userSignupName').value,
        email: document.getElementById('userSignupEmail').value,
        password: document.getElementById('userSignupPassword').value,
        phone: document.getElementById('userSignupPhone').value,
    };
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    
    // Show button loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    }
    
    try {
        // Connect directly to backend API
        if (typeof apiService !== 'undefined') {
            const response = await apiService.userSignup(userData);
            
            // Store token and user info
            if (response.token) {
                apiService.setAuthToken(response.token, 'user');
                currentUser = response.user || { name: userData.name, email: userData.email, phone: userData.phone };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('userType', 'user');
                
                checkAuth();
                closeModal(document.getElementById('userSignupModal'));
                if (typeof showNotification === 'function') {
                    showNotification('Account created successfully!', 'success');
                }
                document.getElementById('userSignupForm').reset();
                
                // Navigate to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } else {
            throw new Error('API service not available');
        }
    } catch (error) {
        // Restore button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        
        // Show error message
        if (typeof showNotification === 'function') {
            showNotification(error.message || 'Failed to create account. Please try again.', 'error');
        } else {
            alert(error.message || 'Failed to create account. Please try again.');
        }
        console.error('Signup error:', error);
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminLoginEmail').value;
    const password = document.getElementById('adminLoginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    
    // Show button loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    }
    
    try {
        // Connect directly to backend API
        if (typeof apiService !== 'undefined') {
            const response = await apiService.adminLogin(email, password);
            
            // Store token and admin info
            if (response.token) {
                apiService.setAuthToken(response.token, 'admin');
                currentAdmin = response.admin || { name: response.name, email: response.email, phone: response.phone, role: response.role };
                // Only store minimal admin info for display, not for data storage
                localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
                localStorage.setItem('userType', 'admin');
                
                checkAuth();
                closeModal(document.getElementById('adminLoginModal'));
                if (typeof showNotification === 'function') {
                    showNotification('Admin login successful!', 'success');
                }
                document.getElementById('adminLoginForm').reset();
                
                // Navigate to admin dashboard
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            }
        } else {
            throw new Error('API service not available');
        }
    } catch (error) {
        // Restore button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        
        // Show error message
        if (typeof showNotification === 'function') {
            showNotification(error.message || 'Invalid email or password', 'error');
        } else {
            alert(error.message || 'Invalid email or password');
        }
        console.error('Admin login error:', error);
    }
}

async function handleAdminSignup(e) {
    e.preventDefault();
    const adminData = {
        name: document.getElementById('adminSignupName').value,
        email: document.getElementById('adminSignupEmail').value,
        password: document.getElementById('adminSignupPassword').value,
        phone: document.getElementById('adminSignupPhone').value,
        role: document.getElementById('adminSignupRole').value,
    };
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    
    // Show button loading state
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    }
    
    try {
        // Connect directly to backend API
        if (typeof apiService !== 'undefined') {
            const response = await apiService.adminSignup(adminData);
            
            // Store token and admin info
            if (response.token) {
                apiService.setAuthToken(response.token, 'admin');
                currentAdmin = response.admin || { name: adminData.name, email: adminData.email, phone: adminData.phone, role: adminData.role };
                localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
                localStorage.setItem('userType', 'admin');
                
                checkAuth();
                closeModal(document.getElementById('adminSignupModal'));
                if (typeof showNotification === 'function') {
                    showNotification('Admin account created successfully!', 'success');
                }
                document.getElementById('adminSignupForm').reset();
                
                // Navigate to admin dashboard
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            }
        } else {
            throw new Error('API service not available');
        }
    } catch (error) {
        // Restore button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        
        // Show error message
        if (typeof showNotification === 'function') {
            showNotification(error.message || 'Failed to create admin account. Please try again.', 'error');
        } else {
            alert(error.message || 'Failed to create admin account. Please try again.');
        }
        console.error('Admin signup error:', error);
    }
}

function handleUserLogout() {
    currentUser = null;
    cart = [];
    if (typeof apiService !== 'undefined') {
        apiService.clearAuth();
    }
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('authToken');
    checkAuth();
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    if (typeof showNotification === 'function') {
        showNotification('Logged out successfully', 'success');
    }
    window.location.href = 'index.html';
}


function handleAdminLogout() {
    // Clear in-memory state
    currentAdmin = null;
    currentUser = null;
    cart = [];

    // Clear auth in apiService and localStorage
    if (typeof apiService !== 'undefined') {
        apiService.clearAuth();
    }
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('cart');

    // Update UI
    checkAuth();
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    if (typeof showNotification === 'function') {
        showNotification('Admin logged out successfully', 'success');
    }

    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}
// var currentUser = JSON.parse(localStorage.getItem('currentUser'));
// var currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
function checkAuth() {
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('authToken');
    const guestActions = document.getElementById('guestActions');
    const userMenu = document.getElementById('userMenu');
    const adminMenu = document.getElementById('adminMenu');

    // Load user/admin data from localStorage if not already loaded
    if (!currentUser && userType === 'user' && token) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                currentUser = JSON.parse(storedUser);
            } catch (error) {
                console.error('Failed to parse user data:', error);
            }
        }
    }
    
    if (!currentAdmin && userType === 'admin' && token) {
        const storedAdmin = localStorage.getItem('currentAdmin');
        if (storedAdmin) {
            try {
                currentAdmin = JSON.parse(storedAdmin);
            } catch (error) {
                console.error('Failed to parse admin data:', error);
            }
        }
    }

    if (userType === 'user' && currentUser) {
        if (guestActions) guestActions.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            const userNameEl = document.getElementById('userName');
            if (userNameEl) userNameEl.textContent = currentUser.name || 'User';
        }
        if (adminMenu) adminMenu.style.display = 'none';
        // Show regular popular medicines section
        if (typeof displayPopularMedicines === 'function') {
            displayPopularMedicines();
        }
    } else if (userType === 'admin' && currentAdmin) {
        if (guestActions) guestActions.style.display = 'none';
        if (userMenu) userMenu.style.display = 'none';
        if (adminMenu) {
            adminMenu.style.display = 'flex';
            const adminNameEl = document.getElementById('adminName');
            if (adminNameEl) adminNameEl.textContent = currentAdmin.name || 'Admin';
        }
        // Show admin popular medicines section
        if (typeof displayPopularMedicines === 'function') {
            displayPopularMedicines();
        }
    } else {
        if (guestActions) guestActions.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        if (adminMenu) adminMenu.style.display = 'none';
        // Show regular popular medicines section
        if (typeof displayPopularMedicines === 'function') {
            displayPopularMedicines();
        }
    }
}

// Medicine Functions
async function loadMedicines() {
    try {
        if (typeof apiService !== 'undefined') {
            const data = await apiService.getMedicines();
            const medicinesList = data.medicines || data || [];
            // Normalize field names (category_id -> categoryId for frontend compatibility)
            medicines = medicinesList.map(med => ({
                id: med.id,
                name: med.name,
                description: med.description || '',
                price: parseFloat(med.price) || 0,
                categoryId: med.category_id || med.categoryId,
                category: med.category_name || med.category || '',
                stock: parseInt(med.stock) || 0,
                image: med.image || '💊',
                sales: parseInt(med.sales) || 0,
                rating: parseFloat(med.rating) || 4.0
            }));
            // Initialize filtered medicines
            filteredMedicines = [...medicines];
            
            // Auto-display medicines if on medicines page
            if (typeof displayMedicines === 'function') {
                displayMedicines();
            }
        } else {
            console.error('API service not available');
            medicines = [];
            filteredMedicines = [];
        }
    } catch (error) {
        console.error('Failed to load medicines from database:', error);
        medicines = [];
        filteredMedicines = [];
        
        // Show error message on medicines page
        const grid = document.getElementById('medicinesGrid');
        if (grid) {
            grid.innerHTML = '<p class="no-results">Failed to load medicines. Please refresh the page or contact support.</p>';
        }
    }
}

async function loadCategories() {
    try {
        if (typeof apiService !== 'undefined') {
            const data = await apiService.getCategories();
            categories = data.categories || data || [];
        } else {
            console.error('API service not available');
            categories = [];
        }
        populateCategoryFilter();
    } catch (error) {
        console.error('Failed to load categories from database:', error);
        categories = [];
        populateCategoryFilter();
    }
}

function populateCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    if (!filter) return;
    
    filter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        filter.appendChild(option);
    });
}

function displayMedicines() {
    const grid = document.getElementById('medicinesGrid');
    if (!grid) return;
    
    // Initialize filteredMedicines if not already set
    if (typeof filteredMedicines === 'undefined' || filteredMedicines.length === 0) {
        filteredMedicines = [...medicines];
    }
    
    // Use filteredMedicines for display
    if (filteredMedicines.length === 0) {
        grid.innerHTML = '<p class="no-results">No medicines found. Please check back later or contact support.</p>';
        return;
    }

    grid.innerHTML = filteredMedicines.map(medicine => createMedicineCard(medicine)).join('');
}

function displayPopularMedicines() {
    // Check if admin is logged in
    const userType = localStorage.getItem('userType');
    const isAdmin = userType === 'admin' && currentAdmin;
    
    if (isAdmin) {
        // Show admin popular medicines section
        const regularSection = document.getElementById('regularPopularSection');
        const adminSection = document.getElementById('adminPopularSection');
        const adminGrid = document.getElementById('adminPopularMedicines');
        
        if (regularSection) regularSection.style.display = 'none';
        if (adminSection) adminSection.style.display = 'block';
        
        // Load admin popular medicines
        loadAdminPopularMedicines();
    } else {
        // Show regular popular medicines section
        const regularSection = document.getElementById('regularPopularSection');
        const adminSection = document.getElementById('adminPopularSection');
        const grid = document.getElementById('popularMedicines');
        
        if (regularSection) regularSection.style.display = 'block';
        if (adminSection) adminSection.style.display = 'none';
        
        if (!grid) return;

        const popular = [...medicines]
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 6);
        
        grid.innerHTML = popular.map(medicine => createMedicineCard(medicine, true)).join('');
    }
}

async function loadAdminPopularMedicines() {
    const adminGrid = document.getElementById('adminPopularMedicines');
    if (!adminGrid) return;

    try {
        let popularMedicines = [];
        if (typeof apiService !== 'undefined') {
            try {
                const popularMedicinesResponse = await apiService.getTopSellingMedicines(6);
                popularMedicines = popularMedicinesResponse.medicines || popularMedicinesResponse || [];
            } catch (error) {
                console.error('Failed to load popular medicines:', error);
                // Fallback: get all medicines and sort by sales
                try {
                    const medicinesResponse = await apiService.getMedicines();
                    const allMedicines = medicinesResponse.medicines || medicinesResponse || [];
                    popularMedicines = [...allMedicines].sort((a, b) => (parseInt(b.sales) || 0) - (parseInt(a.sales) || 0)).slice(0, 6);
                } catch (err) {
                    console.error('Failed to load medicines for fallback:', err);
                    popularMedicines = [];
                }
            }
        } else {
            // Fallback to local medicines array
            popularMedicines = [...medicines]
                .sort((a, b) => (parseInt(b.sales) || 0) - (parseInt(a.sales) || 0))
                .slice(0, 6);
        }
        
        adminGrid.innerHTML = popularMedicines.length > 0
            ? popularMedicines.map(med => createAdminPopularMedicineCard(med)).join('')
            : '<p class="no-data" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No popular medicines available</p>';
    } catch (error) {
        console.error('Failed to load admin popular medicines:', error);
        adminGrid.innerHTML = '<p class="no-data" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">Failed to load popular medicines</p>';
    }
}

function createMedicineCard(medicine, isPopular = false) {
    const isInCart = cart.some(item => item.id === medicine.id);
    const rating = medicine.rating || 4.0;
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    
    return `
        <div class="medicine-card">
        ${isPopular ? '<span class="popular-badge"><i class="fas fa-fire"></i> Popular</span>' : ''}
        <div class="medicine-image">
                ${medicine.image || '💊'}
        </div>
        <div class="medicine-info">
            <h3 class="medicine-name">${medicine.name}</h3>
            <p class="medicine-description">${medicine.description}</p>
                <div class="medicine-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-value">${rating}</span>
            </div>
                <div class="medicine-price">PKR ${medicine.price}</div>
                ${medicine.stock !== undefined ? `<div class="medicine-stock ${medicine.stock === 0 ? 'out-of-stock' : medicine.stock < 20 ? 'low-stock' : ''}">Stock: ${medicine.stock} ${medicine.stock === 0 ? '(Out of Stock)' : ''}</div>` : ''}
            <div class="medicine-actions">
                    <button class="btn-add-cart" onclick="addToCart(${medicine.id})" ${medicine.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i>
                    ${medicine.stock === 0 ? 'Out of Stock' : isInCart ? 'Add More' : 'Add to Cart'}
                </button>
                    <button class="btn-book" onclick="quickOrder(${medicine.id})">
                    <i class="fas fa-shopping-bag"></i>
                        Quick Order
                </button>
                </div>
            </div>
        </div>
    `;
}

// Cart Functions
async function loadCart() {
    cart = [];
    
    // Load cart from database if user is logged in (check token)
    const token = localStorage.getItem('authToken');
    const userType = localStorage.getItem('userType');
    
    if (token && userType === 'user' && typeof apiService !== 'undefined') {
        try {
            const data = await apiService.getCart();
            if (data && data.items) {
                // Map database cart items to frontend format
                cart = data.items.map(item => ({
                    id: item.medicine_id,
                    cartItemId: item.id,
                    name: item.name,
                    description: item.description,
                    price: parseFloat(item.price),
                    image: item.image || '💊',
                    stock: item.stock || 0,
                    quantity: item.quantity || 1
                }));
            } else if (data && Array.isArray(data)) {
                cart = data.map(item => ({
                    id: item.medicine_id,
                    cartItemId: item.id,
                    name: item.name,
                    description: item.description,
                    price: parseFloat(item.price),
                    image: item.image || '💊',
                    stock: item.stock || 0,
                    quantity: item.quantity || 1
                }));
            }
        } catch (error) {
            console.error('Failed to load cart from database:', error);
            cart = [];
        }
    }
    
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

async function addToCart(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) {
        if (typeof showNotification === 'function') {
            showNotification('Medicine not found', 'error');
        }
        return;
    }

    // Check if user is logged in
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('authToken');
    
    if (!token || userType !== 'user') {
        if (typeof showNotification === 'function') {
            showNotification('Please login or sign up to add items to cart', 'error');
        }
        // Open signup modal
        const signupModal = document.getElementById('userSignupModal');
        if (signupModal && typeof openModal === 'function') {
            openModal(signupModal);
        }
        return;
    }

    // Check stock availability
    const currentStock = medicine.stock || 0;
    const existingItem = cart.find(item => item.id === medicineId);
    const currentQuantity = existingItem ? (existingItem.quantity || 1) : 0;
    const newQuantity = currentQuantity + 1;

    if (currentStock === 0) {
        if (typeof showNotification === 'function') {
            showNotification(`${medicine.name} is out of stock`, 'error');
        }
        return;
    }

    if (newQuantity > currentStock) {
        if (typeof showNotification === 'function') {
            showNotification(`Only ${currentStock} units available in stock for ${medicine.name}`, 'error');
        }
        return;
    }

    // Add to cart via API
    try {
        if (typeof apiService !== 'undefined') {
            await apiService.addToCart({ medicineId, quantity: 1 });
            
            // Reload cart from database
            await loadCart();
            
            // Update UI
            if (typeof displayMedicines === 'function') displayMedicines();
            if (typeof displayPopularMedicines === 'function') displayPopularMedicines();
            if (typeof displayCart === 'function') displayCart();
            if (typeof showNotification === 'function') {
                showNotification(`${medicine.name} added to cart!`, 'success');
            }
        } else {
            throw new Error('API service not available');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        if (typeof showNotification === 'function') {
            showNotification(error.message || 'Failed to add item to cart. Please try again.', 'error');
        }
    }
}

async function quickOrder(medicineId) {
    // Check if admin is logged in
    const userType = localStorage.getItem('userType');
    const isAdmin = userType === 'admin' && currentAdmin;
    
    if (isAdmin) {
        // If admin, open user signup modal instead of checkout
        const signupModal = document.getElementById('userSignupModal');
        if (signupModal && typeof openModal === 'function') {
            openModal(signupModal);
        }
        if (typeof showNotification === 'function') {
            showNotification('Please create a user account to place orders', 'info');
        }
        return;
    }
    
    // For regular users and guests, proceed with normal quick order flow
    await addToCart(medicineId);
    // Navigate to checkout page
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}

function openCart() {
    displayCart();
    openModal(document.getElementById('cartModal'));
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        }
        if (cartTotal) cartTotal.textContent = '0';
        return;
    }

    if (cartItems) {
        cartItems.innerHTML = cart.map(item => {
            const medicine = medicines.find(m => m.id === item.id);
            const currentStock = medicine ? (medicine.stock || 0) : (item.stock || 0);
            const cartQuantity = item.quantity || 1;
            const canIncrease = cartQuantity < currentStock;
            const cartItemId = item.cartItemId || item.id;
            
            return `
            <div class="cart-item">
                <div class="cart-item-image">${item.image || '💊'}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">PKR ${item.price} each</div>
                    ${currentStock > 0 ? `<div class="cart-item-stock">Available: ${currentStock} units</div>` : '<div class="cart-item-stock out-of-stock">Out of Stock</div>'}
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${cartItemId}, -1)">-</button>
                        <span class="quantity-value">${cartQuantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${cartItemId}, 1)" ${!canIncrease ? 'disabled' : ''}>+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${cartItemId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        }).join('');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

async function updateQuantity(cartItemId, change) {
    const item = cart.find(item => (item.cartItemId || item.id) === cartItemId);
    if (!item) return;

    const newQuantity = (item.quantity || 1) + change;
    if (newQuantity <= 0) {
        await removeFromCart(cartItemId);
        return;
    }

    // Check stock availability
    const medicine = medicines.find(m => m.id === item.id);
    if (medicine) {
        const currentStock = medicine.stock || 0;
        if (newQuantity > currentStock) {
            if (typeof showNotification === 'function') {
                showNotification(`Only ${currentStock} units available in stock for ${medicine.name}`, 'error');
            }
            return;
        }
    }

    // Update via API
    try {
        if (typeof apiService !== 'undefined') {
            await apiService.updateCartItem(cartItemId, newQuantity);
            // Reload cart from database
            await loadCart();
            // Update UI
            displayCart();
            if (typeof displayMedicines === 'function') displayMedicines();
            if (typeof displayPopularMedicines === 'function') displayPopularMedicines();
        } else {
            throw new Error('API service not available');
        }
    } catch (error) {
        console.error('Update quantity error:', error);
        if (typeof showNotification === 'function') {
            showNotification('Failed to update quantity. Please try again.', 'error');
        }
    }
}

async function removeFromCart(cartItemId) {
    const item = cart.find(item => (item.cartItemId || item.id) === cartItemId);
    if (!item) return;

    // Remove via API
    try {
        if (typeof apiService !== 'undefined') {
            await apiService.removeFromCart(cartItemId);
            // Reload cart from database
            await loadCart();
            // Update UI
            displayCart();
            if (typeof displayMedicines === 'function') displayMedicines();
            if (typeof displayPopularMedicines === 'function') displayPopularMedicines();
            if (typeof showNotification === 'function') {
                showNotification('Item removed from cart', 'success');
            }
        } else {
            throw new Error('API service not available');
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        if (typeof showNotification === 'function') {
            showNotification('Failed to remove item. Please try again.', 'error');
        }
    }
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountEl.textContent = count;
    }
}

async function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    if (!currentUser) {
        showNotification('Please login to checkout', 'error');
        closeModal(document.getElementById('cartModal'));
        openModal(document.getElementById('userLoginModal'));
        return;
    }

    // Redirect to checkout page
    closeModal(document.getElementById('cartModal'));
    window.location.href = 'checkout.html';
}

// Dashboard Functions
async function loadUserDashboard() {
    if (typeof showLoading === 'function') {
        showLoading();
    }
    
    try {
        // Load orders from database
        let orders = [];
        if (typeof apiService !== 'undefined') {
            const response = await apiService.getUserOrders();
            orders = response.orders || response || [];
        }
        
        const stats = {
            total: orders.length || 0,
            pending: orders.filter(o => o.status === 'pending').length || 0,
            completed: orders.filter(o => o.status === 'completed').length || 0,
            totalSpent: orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
        };

        const totalOrdersEl = document.getElementById('totalOrders');
        const pendingOrdersEl = document.getElementById('pendingOrders');
        const completedOrdersEl = document.getElementById('completedOrders');
        const totalSpentEl = document.getElementById('totalSpent');
        const recentOrdersEl = document.getElementById('recentOrders');
        
        if (totalOrdersEl) totalOrdersEl.textContent = stats.total;
        if (pendingOrdersEl) pendingOrdersEl.textContent = stats.pending;
        if (completedOrdersEl) completedOrdersEl.textContent = stats.completed;
        if (totalSpentEl) totalSpentEl.textContent = `PKR ${stats.totalSpent.toFixed(2)}`;

        const recentOrders = orders.slice(0, 5);
        if (recentOrdersEl) {
            recentOrdersEl.innerHTML = recentOrders.length > 0
                ? recentOrders.map(order => createOrderCard(order)).join('')
                : '<p class="no-data">No orders yet</p>';
        }
    } catch (error) {
        console.error('Failed to load user dashboard:', error);
    } finally {
        if (typeof hideLoading === 'function') {
            hideLoading();
        }
    }
}

// async function loadAdminDashboard() {
//     if (typeof showLoading === 'function') {
//         showLoading();
//     }
    
//     try {
//         // Try API first
//         let stats = {};
//         if (typeof apiService !== 'undefined') {
//             try {
//                 stats = await apiService.getDashboardStats();
//             } catch (error) {
//                 // Fallback to localStorage calculation
//                 const orders = JSON.parse(localStorage.getItem('orders')) || [];
//                 const users = JSON.parse(localStorage.getItem('users')) || [];
//                 const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
                
//                 stats = {
//                     totalUsers: users.length,
//                     totalOrders: orders.length,
//                     totalMedicines: medicines.length,
//                     totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
//                     lowStockItems: medicines.filter(m => (m.stock || 0) < 20 && (m.stock || 0) > 0).length,
//                     pendingOrders: orders.filter(o => o.status === 'pending').length
//                 };
//             }
//         } else {
//             // Calculate from localStorage
//             const orders = JSON.parse(localStorage.getItem('orders')) || [];
//             const users = JSON.parse(localStorage.getItem('users')) || [];
//             const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
            
//             stats = {
//                 totalUsers: users.length,
//                 totalOrders: orders.length,
//                 totalMedicines: medicines.length,
//                 totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
//                 lowStockItems: medicines.filter(m => (m.stock || 0) < 20 && (m.stock || 0) > 0).length,
//                 pendingOrders: orders.filter(o => o.status === 'pending').length
//             };
//         }
        
//         const adminTotalUsersEl = document.getElementById('adminTotalUsers');
//         const adminTotalOrdersEl = document.getElementById('adminTotalOrders');
//         const adminTotalMedicinesEl = document.getElementById('adminTotalMedicines');
//         const adminTotalRevenueEl = document.getElementById('adminTotalRevenue');
//         const adminLowStockEl = document.getElementById('adminLowStock');
//         const adminPendingOrdersEl = document.getElementById('adminPendingOrders');
        
//         if (adminTotalUsersEl) adminTotalUsersEl.textContent = stats.totalUsers || 0;
//         if (adminTotalOrdersEl) adminTotalOrdersEl.textContent = stats.totalOrders || 0;
//         if (adminTotalMedicinesEl) adminTotalMedicinesEl.textContent = stats.totalMedicines || 0;
//         if (adminTotalRevenueEl) adminTotalRevenueEl.textContent = `PKR ${(stats.totalRevenue || 0).toFixed(2)}`;
//         if (adminLowStockEl) adminLowStockEl.textContent = stats.lowStockItems || 0;
//         if (adminPendingOrdersEl) adminPendingOrdersEl.textContent = stats.pendingOrders || 0;

//         // Load recent orders
//         let recentOrders = [];
//         if (typeof apiService !== 'undefined') {
//             try {
//                 recentOrders = await apiService.getOrders({ limit: 5 });
//             } catch (error) {
//                 const orders = JSON.parse(localStorage.getItem('orders')) || [];
//                 recentOrders = orders.slice(-5).reverse();
//             }
//         } else {
//             const orders = JSON.parse(localStorage.getItem('orders')) || [];
//             recentOrders = orders.slice(-5).reverse();
//         }
        
//         const adminRecentOrdersEl = document.getElementById('adminRecentOrders');
//         if (adminRecentOrdersEl) {
//             adminRecentOrdersEl.innerHTML = recentOrders.length > 0
//                 ? recentOrders.map(order => createOrderCard(order, true)).join('')
//                 : '<p class="no-data">No orders yet</p>';
//         }

//         // Load top medicines
//         let topMedicines = [];
//         if (typeof apiService !== 'undefined') {
//             try {
//                 topMedicines = await apiService.getTopSellingMedicines(5);
//             } catch (error) {
//                 const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
//                 topMedicines = [...medicines].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5);
//             }
//         } else {
//             const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
//             topMedicines = [...medicines].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5);
//         }
        
//         const topSellingMedicinesEl = document.getElementById('topSellingMedicines');
//         if (topSellingMedicinesEl) {
//             topSellingMedicinesEl.innerHTML = topMedicines.length > 0
//                 ? topMedicines.map(med => createTopMedicineCard(med)).join('')
//                 : '<p class="no-data">No data available</p>';
//         }
//     } catch (error) {
//         console.error('Failed to load admin dashboard:', error);
//     } finally {
//         if (typeof hideLoading === 'function') {
//             hideLoading();
//         }
//     }
// }
async function loadAdminDashboard() {
    if (typeof showLoading === 'function') {
        showLoading();
    }
    
    try {
        // Load stats from database
        let stats = {};
        if (typeof apiService !== 'undefined') {
            try {
                const response = await apiService.getDashboardStats();
                // Handle both direct object and wrapped response
                stats = response.stats || response || {};
                console.log('Raw dashboard stats response:', response);
                console.log('Processed stats:', stats);
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
                console.error('Error details:', error.message, error.stack);
                stats = {
                    totalUsers: 0,
                    totalOrders: 0,
                    totalMedicines: 0,
                    totalRevenue: 0,
                    lowStockItems: 0,
                    pendingOrders: 0
                };
            }
        } else {
            console.error('API service not available');
            stats = {
                totalUsers: 0,
                totalOrders: 0,
                totalMedicines: 0,
                totalRevenue: 0,
                lowStockItems: 0,
                pendingOrders: 0
            };
        }
        
        const adminTotalUsersEl = document.getElementById('adminTotalUsers');
        const adminTotalOrdersEl = document.getElementById('adminTotalOrders');
        const adminTotalMedicinesEl = document.getElementById('adminTotalMedicines');
        const adminTotalRevenueEl = document.getElementById('adminTotalRevenue');
        const adminLowStockEl = document.getElementById('adminLowStock');
        const adminPendingOrdersEl = document.getElementById('adminPendingOrders');
        
        // Log stats for debugging
        console.log('Dashboard stats received:', stats);
        
        // Ensure we have valid numbers
        const totalUsers = parseInt(stats.totalUsers) || 0;
        const totalOrders = parseInt(stats.totalOrders) || 0;
        const totalMedicines = parseInt(stats.totalMedicines) || 0;
        const totalRevenue = parseFloat(stats.totalRevenue) || 0;
        const lowStockItems = parseInt(stats.lowStockItems) || 0;
        const pendingOrders = parseInt(stats.pendingOrders) || 0;
        
        if (adminTotalUsersEl) adminTotalUsersEl.textContent = totalUsers;
        if (adminTotalOrdersEl) adminTotalOrdersEl.textContent = totalOrders;
        if (adminTotalMedicinesEl) adminTotalMedicinesEl.textContent = totalMedicines;
        if (adminTotalRevenueEl) adminTotalRevenueEl.textContent = `PKR ${totalRevenue.toFixed(2)}`;
        if (adminLowStockEl) adminLowStockEl.textContent = lowStockItems;
        if (adminPendingOrdersEl) adminPendingOrdersEl.textContent = pendingOrders;

        // Load recent orders with full details
        let recentOrders = [];
        if (typeof apiService !== 'undefined') {
            try {
                const response = await apiService.getOrders({ limit: 5 });
                recentOrders = response.orders || response || [];
                
                // Load order items for each recent order to show details
                await Promise.all(recentOrders.map(async (order) => {
                    try {
                        const itemsResponse = await apiService.getOrderItems(order.id);
                        order.items = itemsResponse.items || itemsResponse || [];
                    } catch (error) {
                        console.error(`Failed to load items for order ${order.id}:`, error);
                        order.items = [];
                    }
                }));
            } catch (error) {
                console.error('Failed to load recent orders:', error);
                recentOrders = [];
            }
        }
        
        const adminRecentOrdersEl = document.getElementById('adminRecentOrders');
        if (adminRecentOrdersEl) {
            adminRecentOrdersEl.innerHTML = recentOrders.length > 0
                ? recentOrders.map(order => createAdminOrderCard(order)).join('')
                : '<p class="no-data">No orders yet</p>';
        }

        // Load top medicines for the compact list
        let topMedicines = [];
        if (typeof apiService !== 'undefined') {
            try {
                const topMedicinesResponse = await apiService.getTopSellingMedicines(5);
                topMedicines = topMedicinesResponse.medicines || topMedicinesResponse || [];
            } catch (error) {
                console.error('Failed to load top medicines:', error);
                // Fallback: get all medicines and sort by sales
                try {
                    const medicinesResponse = await apiService.getMedicines();
                    const allMedicines = medicinesResponse.medicines || medicinesResponse || [];
                    topMedicines = [...allMedicines].sort((a, b) => (parseInt(b.sales) || 0) - (parseInt(a.sales) || 0)).slice(0, 5);
                } catch (err) {
                    console.error('Failed to load medicines for fallback:', err);
                    topMedicines = [];
                }
            }
        } else {
            topMedicines = [];
        }
        
        const topSellingMedicinesEl = document.getElementById('topSellingMedicines');
        if (topSellingMedicinesEl) {
            topSellingMedicinesEl.innerHTML = topMedicines.length > 0
                ? topMedicines.map(med => createTopMedicineCard(med)).join('')
                : '<p class="no-data">No data available</p>';
        }
    } catch (error) {
        console.error('Failed to load admin dashboard:', error);
    } finally {
        if (typeof hideLoading === 'function') {
            hideLoading();
        }
    }
}


function createOrderCard(order, isAdmin = false) {
    // ✅ Normalize date from ANY possible field
    let rawDate =
        order.date ??
        order.created_at ??
        order.createdAt ??
        null;

    let dateObj;

    if (typeof rawDate === 'number') {
        dateObj = new Date(rawDate);
    } else if (typeof rawDate === 'string') {
        // MySQL DATETIME → ISO safe
        dateObj = new Date(rawDate.replace(' ', 'T'));
    } else {
        dateObj = new Date(NaN);
    }

    const formattedDate = isNaN(dateObj.getTime())
        ? '—'
        : dateObj.toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

    return `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status status-${order.status}">
                    ${order.status}
                </span>
            </div>
            <div class="order-details">
                <p><strong>Total:</strong> PKR ${parseFloat(order.total).toFixed(2)}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                ${isAdmin && order.user ? `<p><strong>User:</strong> ${order.user.name}</p>` : ''}
            </div>
        </div>
    `;
}


function createAdminOrderCard(order) {
    const orderDate = new Date(order.created_at || order.createdAt || order.date);
    const user_name = order.user_name || order.user?.name || 'Unknown Customer';
    const user_email = order.user_email || order.user?.email || '';
    const items_count = order.items_count || (order.items ? order.items.length : 0);
    const payment_method = order.payment_method || order.paymentMethod || 'Cash on Delivery';
    const shipping_address = order.shipping_address || '';
    
    // Format items preview
    const itemsPreview = (order.items || []).slice(0, 3).map(item => 
        `${item.medicine_name || item.name || 'Medicine'} (Qty: ${item.quantity || 1})`
    ).join(', ');
    const moreItems = (order.items || []).length > 3 ? ` +${(order.items || []).length - 3} more` : '';
    
    return `
        <div class="admin-order-card" onclick="viewAdminOrderDetails(${order.id})" style="cursor: pointer; margin-bottom: 15px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background: #fff; transition: all 0.3s;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">
                        <i class="fas fa-shopping-bag"></i> Order #${order.id}
                    </h4>
                    <p style="margin: 0; color: #666; font-size: 0.9em;">
                        <i class="fas fa-calendar"></i> ${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}
                    </p>
                </div>
                <span class="order-status status-${order.status || 'pending'}" style="padding: 5px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 600;">
                    ${(order.status || 'pending').toUpperCase()}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
                        <strong><i class="fas fa-user"></i> Customer:</strong><br>
                        ${user_name}
                        ${user_email ? `<br><span style="color: #999; font-size: 0.85em;">${user_email}</span>` : ''}
                    </p>
                </div>
                <div>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
                        <strong><i class="fas fa-credit-card"></i> Payment:</strong><br>
                        ${payment_method}
                    </p>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
                    <strong><i class="fas fa-box"></i> Items (${items_count}):</strong><br>
                    <span style="color: #333;">${itemsPreview || 'No items'}${moreItems}</span>
                </p>
            </div>
            
            ${shipping_address ? `
            <div style="margin-bottom: 10px;">
                <p style="margin: 5px 0; color: #666; font-size: 0.9em;">
                    <strong><i class="fas fa-map-marker-alt"></i> Address:</strong><br>
                    <span style="color: #333;">${shipping_address.length > 60 ? shipping_address.substring(0, 60) + '...' : shipping_address}</span>
                </p>
            </div>
            ` : ''}
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                <div>
                    <strong style="color: #4CAF50; font-size: 1.1em;">
                        Total: PKR ${parseFloat(order.total || 0).toFixed(2)}
                    </strong>
                </div>
                <button onclick="event.stopPropagation(); viewAdminOrderDetails(${order.id})" 
                        style="padding: 6px 15px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9em;">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `;
}

// Function to view order details in admin dashboard
let isLoadingOrderDetails = false;
async function viewAdminOrderDetails(orderId) {
    // Prevent multiple simultaneous calls
    if (isLoadingOrderDetails) {
        return;
    }
    
    try {
        isLoadingOrderDetails = true;
        
        if (typeof apiService === 'undefined') {
            throw new Error('API service not available');
        }
        
        // Get or create modal
        let modal = document.getElementById('adminOrderDetailsModal');
        const contentDiv = document.getElementById('adminOrderDetailsContent');
        
        if (!modal || !contentDiv) {
            console.error('Modal elements not found');
            if (typeof showNotification === 'function') {
                showNotification('Unable to display order details. Please refresh the page.', 'error');
            }
            return;
        }
        
        // Show loading state
        contentDiv.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin" style="font-size: 2em; color: #4CAF50;"></i><p style="margin-top: 20px;">Loading order details...</p></div>';
        
        // Show modal by removing inline display style and adding show class
        modal.style.display = '';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Fetch order data with timeout
        const orderPromise = apiService.getOrderById(orderId);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const response = await Promise.race([orderPromise, timeoutPromise]);
        const order = response.order || response;
        
        if (!order || !order.id) {
            contentDiv.innerHTML = '<div style="text-align: center; padding: 40px; color: #e74c3c;"><i class="fas fa-exclamation-triangle" style="font-size: 2em;"></i><p style="margin-top: 20px;">Order not found</p></div>';
            if (typeof showNotification === 'function') {
                showNotification('Order not found', 'error');
            }
            return;
        }
        
        // Load order items if not already loaded
        if (!order.items || order.items.length === 0) {
            try {
                const itemsResponse = await apiService.getOrderItems(orderId);
                order.items = itemsResponse.items || itemsResponse || [];
            } catch (error) {
                console.error('Failed to load order items:', error);
                order.items = [];
            }
        }
        
        // Create modal content
        const orderDate = new Date(order.created_at || order.createdAt || order.date);
        const modalContent = `
            <div style="max-width: 600px; margin: 0 auto;">
                <h2 style="margin-bottom: 20px; color: #333;">
                    <i class="fas fa-shopping-bag"></i> Order Details #${order.id}
                </h2>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id}</p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${orderDate.toLocaleString()}</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> 
                                <span class="order-status status-${order.status || 'pending'}">
                                    ${(order.status || 'pending').toUpperCase()}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p style="margin: 5px 0;"><strong>Customer:</strong> ${order.user_name || 'Unknown'}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${order.user_email || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Payment:</strong> ${order.payment_method || order.paymentMethod || 'Cash on Delivery'}</p>
                        </div>
                    </div>
                </div>
                
                <h3 style="margin: 20px 0 10px 0; color: #333;">Order Items</h3>
                <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    ${(order.items && order.items.length > 0) ? order.items.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                            <div>
                                <strong>${item.medicine_name || item.name || 'Medicine'}</strong>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">
                                    Quantity: ${item.quantity || 1} × PKR ${parseFloat(item.price || 0).toFixed(2)}
                                </p>
                            </div>
                            <div style="text-align: right;">
                                <strong style="color: #4CAF50;">
                                    PKR ${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </strong>
                            </div>
                        </div>
                    `).join('') : '<p style="text-align: center; color: #999;">No items found</p>'}
                </div>
                
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Subtotal:</span>
                        <strong>PKR ${parseFloat(order.total || 0).toFixed(2)}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Delivery Charges:</span>
                        <strong>PKR 200.00</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #4CAF50; font-size: 1.1em;">
                        <strong>Total:</strong>
                        <strong style="color: #4CAF50;">PKR ${(parseFloat(order.total || 0) + 200).toFixed(2)}</strong>
                    </div>
                </div>
                
                ${order.shipping_address ? `
                <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">
                        <i class="fas fa-map-marker-alt"></i> Delivery Address
                    </h3>
                    <p style="margin: 0; color: #666; line-height: 1.6;">${order.shipping_address}</p>
                </div>
                ` : ''}
            </div>
        `;
        
        // Update modal content
        contentDiv.innerHTML = modalContent;
        
    } catch (error) {
        console.error('Failed to load order details:', error);
        const contentDiv = document.getElementById('adminOrderDetailsContent');
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c;">
                    <i class="fas fa-exclamation-circle" style="font-size: 2em;"></i>
                    <p style="margin-top: 20px;">Failed to load order details</p>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #999;">${error.message || 'Please try again'}</p>
                </div>
            `;
        }
        if (typeof showNotification === 'function') {
            showNotification('Failed to load order details. Please try again.', 'error');
        }
    } finally {
        isLoadingOrderDetails = false;
    }
}

function closeAdminOrderModal() {
    const modal = document.getElementById('adminOrderDetailsModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        // Clear content after closing animation
        setTimeout(() => {
            const contentDiv = document.getElementById('adminOrderDetailsContent');
            if (contentDiv) {
                contentDiv.innerHTML = '';
            }
        }, 300);
    }
}

function createTopMedicineCard(medicine) {
    return `
        <div class="top-medicine-card">
            <div class="top-medicine-image">${medicine.image || '💊'}</div>
            <div class="top-medicine-info">
                <h4>${medicine.name}</h4>
                <p>Sales: ${medicine.sales || 0} units</p>
            </div>
        </div>
    `;
}

function createAdminPopularMedicineCard(medicine) {
    const rating = medicine.rating || 4.0;
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    const sales = parseInt(medicine.sales) || 0;
    
    return `
        <div class="medicine-card">
            <span class="popular-badge"><i class="fas fa-fire"></i> Popular</span>
            <div class="medicine-image">
                ${medicine.image || '💊'}
            </div>
            <div class="medicine-info">
                <h3 class="medicine-name">${medicine.name}</h3>
                <p class="medicine-description">${medicine.description || 'Quality medicine'}</p>
                <div class="medicine-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-value">${rating}</span>
                </div>
                <div class="medicine-price">PKR ${medicine.price || 0}</div>
                ${medicine.stock !== undefined ? `<div class="medicine-stock ${medicine.stock === 0 ? 'out-of-stock' : medicine.stock < 20 ? 'low-stock' : ''}">Stock: ${medicine.stock} ${medicine.stock === 0 ? '(Out of Stock)' : ''}</div>` : ''}
                <div class="medicine-sales" style="margin-top: 0.5rem; padding: 0.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; text-align: center; font-weight: 600;">
                    <i class="fas fa-chart-line"></i> Sales: ${sales} units
                </div>
            </div>
        </div>
    `;
}

// Search and Filter
let filteredMedicines = [];

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    applyFilters();
}

function handleSort() {
    applyFilters();
}

function handleCategoryFilter() {
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    
    if (!searchInput || !categoryFilter || !sortSelect) {
        filteredMedicines = [...medicines];
        displayFilteredMedicines();
        return;
    }
    
    const query = searchInput.value.toLowerCase();
    const categoryId = categoryFilter.value;
    const sortBy = sortSelect.value;
    
    // Filter by search query
    filteredMedicines = medicines.filter(medicine => {
        const matchesSearch = !query || 
            medicine.name.toLowerCase().startsWith(query) ;
           
        
        const matchesCategory = !categoryId || 
            medicine.categoryId == categoryId ||
            medicine.categoryId === parseInt(categoryId);
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort medicines
    switch(sortBy) {
        case 'name':
            filteredMedicines.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredMedicines.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredMedicines.sort((a, b) => b.price - a.price);
            break;
        case 'sales':
            filteredMedicines.sort((a, b) => (b.sales || 0) - (a.sales || 0));
            break;
        case 'rating':
            filteredMedicines.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
    }
    
    displayFilteredMedicines();
}

function displayFilteredMedicines() {
    const grid = document.getElementById('medicinesGrid');
    if (!grid) return;
    
    if (filteredMedicines.length === 0) {
        grid.innerHTML = '<p class="no-results">No medicines found matching your criteria.</p>';
        return;
    }
    
    grid.innerHTML = filteredMedicines.map(medicine => createMedicineCard(medicine)).join('');
}

// displayMedicines function is defined earlier in the file

// UI Helpers
function toggleUserDropdown() {
    document.getElementById('userDropdownMenu').classList.toggle('show');
}

function toggleAdminDropdown() {
    document.getElementById('adminDropdownMenu').classList.toggle('show');
}

function openModal(modal) {
    if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    }
}

function showLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
