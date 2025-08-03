import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getCartItems,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);

  // 🔁 Fetch Cart Items from backend
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await getCartItems(token);
      console.log("🛒 Cart items fetched:", res.data);
      setCart(res.data);
    } catch (err) {
      console.error("Fetch cart failed", err);
    }
  };


  // 🔄 Load cart on token change
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [token]);

  // ➕ Add item to cart
  const addToCart = async (mealId, quantity = 1) => {
    if (!token || !mealId) {
      console.warn("Token or meal ID missing.");
      return;
    }
    try {
      await apiAddToCart(token, mealId, quantity);
      await fetchCart(); // ⬅️ Ensures updated cart is loaded
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };


  // 🔁 Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (!token) return;
    if (quantity <= 0) return removeItem(itemId);

    try {
      await updateCartItem(token, itemId, quantity);
      await fetchCart(); // ensure state updates
    } catch (err) {
      console.error('Update cart item failed', err);
    }
  };


  // ❌ Remove item from cart
  const removeItem = (itemId) => {
    if (!token) return;

    removeCartItem(token, itemId)
      .then(fetchCart)
      .catch(err => console.error('❌ Remove item failed', err));
  };

  // 🚫 Clear entire cart
  const clearAll = () => {
    if (!token) return;

    clearCart(token)
      .then(() => setCart([]))
      .catch(err => console.error('❌ Clear cart failed', err));
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateQuantity, removeItem, clearAll }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
