package com.mealCraft.service;

import com.mealCraft.model.CartItem;
import com.mealCraft.model.MealItem;
import com.mealCraft.model.User;
import com.mealCraft.repository.CartItemRepository;
import com.mealCraft.repository.MealItemRepository;
import com.mealCraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private MealItemRepository mealItemRepository;

    // ✅ Add or update item in user's cart
    public void addToCart(User user, CartItem item) {
        MealItem meal = item.getMeal();
        Optional<CartItem> existing = cartItemRepository.findByUserAndMeal(user, meal);
        if (existing.isPresent()) {
            CartItem existingItem = existing.get();
            existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            item.setUser(user);
            cartItemRepository.save(item);
        }
    }

    // ✅ Get all cart items for a user
    public List<CartItem> getCartItems(User user) {
        return cartItemRepository.findByUser(user);
    }

    // ✅ Update item quantity
    public void updateCartItem(User user, Long itemId, int newQuantity) {
        CartItem item = cartItemRepository.findByIdAndUser(itemId, user)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
    }

    // ✅ Remove single item
    public void removeFromCart(User user, Long itemId) {
        CartItem item = cartItemRepository.findByIdAndUser(itemId, user)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        cartItemRepository.delete(item);
    }

    // ✅ Clear all items from user's cart
    public void clearCart(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(items);
    }
}
