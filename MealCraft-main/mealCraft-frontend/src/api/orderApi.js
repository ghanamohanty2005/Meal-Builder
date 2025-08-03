import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/orders';

// 🔐 Get token from localStorage
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// ✅ Place an order
export const placeOrder = (orderData) => {
  return axios.post(`${BASE_URL}/place`, orderData, getAuthHeaders());
};

// ✅ Get order history
export const fetchOrderHistory = () => {
  return axios.get(`${BASE_URL}/history`, getAuthHeaders());
};
