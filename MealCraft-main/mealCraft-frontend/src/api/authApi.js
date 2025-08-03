import axios from 'axios';

// Create Axios instance with base URL for authenticated API calls
const authApi = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Automatically attach JWT token to all requests
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Public Authentication APIs ---

// POST /auth/login
export const loginUser = (credentials) => {
  return axios.post('http://localhost:8080/api/auth/login', credentials);
};

// POST /auth/register
export const registerUser = (userData) => {
  return axios.post('http://localhost:8080/api/auth/register', userData);
};

// --- Secure APIs (Require JWT) ---

// GET /profile - fetch profile
export const fetchUserProfile = () => {
  return authApi.get('/profile');
};

// PUT /profile - update name/email/location
export const updateUserSettings = (data) => {
  return authApi.put('/profile', data);
};

// PUT /profile/pic - upload profile image
export const uploadProfilePic = (formData) => {
  return authApi.put('/profile/pic', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// GET /orders - fetch order history
export const fetchOrderHistory = () => {
  return authApi.get('/orders');
};

// GET /cart - fetch cart items
export const fetchUserCart = () => {
  return authApi.get('/cart');
};

// POST /cart/add - add item to cart
export const addToCart = (item) => {
  return authApi.post('/cart/add', item);
};

export default authApi;
