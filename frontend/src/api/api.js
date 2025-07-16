import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' }); // Updated to match backend

// Products
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const fetchFeaturedProducts = () => API.get('/products/featured');

// Cart
export const fetchCart = (userId) => API.get(`/cart/${userId}`);
export const addToCart = (userId, productId, quantity = 1, size, color) => API.post('/cart', { userId, productId, quantity, size, color });
export const updateCartItem = (itemId, quantity) => API.put(`/cart/${itemId}`, { quantity });
export const removeCartItem = (itemId) => API.delete(`/cart/${itemId}`);
export const clearCart = (userId) => API.delete(`/cart/user/${userId}`);

// User Auth
export const login = (credentials) => API.post('/login', credentials, { withCredentials: true });
export const register = (data) => API.post('/signup', data, { withCredentials: true });
export const logout = () => API.get('/logout', { withCredentials: true });
// Optionally, add a function to check current user session
// export const getCurrentUser = () => API.get('/me', { withCredentials: true }); 

// User Details
export const fetchUserDetails = (userId) => API.get(`/userdetails/${userId}`);
export const saveUserDetails = (data) => API.post('/userdetails', data);

// Orders
export const placeOrder = (orderData) => API.post('/orders', orderData);
export const fetchOrders = (userId) => API.get(`/orders/${userId}`); 

// Seller Product Management
export const fetchSellerProducts = (sellerId) => API.get(`/seller/products?sellerId=${sellerId}`);
export const addSellerProduct = (data) => API.post('/seller/products', data);
export const deleteSellerProduct = (productId, sellerId) => API.delete(`/seller/products/${productId}`, { data: { sellerId } });

// Seller Orders
export const fetchSellerOrders = (sellerId) => API.get(`/orders/seller/${sellerId}`); 