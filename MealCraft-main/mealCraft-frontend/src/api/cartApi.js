import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/cart';

export const getCartItems = (token) =>
  axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addToCart = (token, mealId, quantity) =>
  axios.post(
    BASE_URL, // POST /api/cart
    { mealId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const updateCartItem = (token, itemId, quantity) =>
  axios.put(
    `${BASE_URL}/update/${itemId}`, // ✅ matches PUT /api/cart/update/{itemId}
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const removeCartItem = (token, itemId) =>
  axios.delete(`${BASE_URL}/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const clearCart = (token) =>
  axios.delete(`${BASE_URL}/clear`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
