package com.mealCraft.controller;

import com.mealCraft.dto.CartItemRequest;
import com.mealCraft.model.CartItem;
import com.mealCraft.model.MealItem;
import com.mealCraft.model.User;
import com.mealCraft.repository.MealItemRepository;
import com.mealCraft.repository.UserRepository;
import com.mealCraft.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MealItemRepository mealItemRepository;

    // ✅ Utility: Get current authenticated user
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ GET /api/cart
    @GetMapping
    public List<CartItem> getUserCart() {
        User user = getCurrentUser();
        return cartService.getCartItems(user);
    }

    // ✅ POST /api/cart (add to cart)
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request) {
        User user = getCurrentUser();

        MealItem meal = mealItemRepository.findById(request.getMealId())
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        CartItem newItem = new CartItem();
        newItem.setMeal(meal);
        newItem.setQuantity(request.getQuantity());

        cartService.addToCart(user, newItem);
        return ResponseEntity.ok("✅ Meal added to cart");
    }

    // ✅ PUT /api/cart/update/{itemId}
    @PutMapping("/update/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId,
                                            @RequestBody CartItemRequest request) {
        User user = getCurrentUser();
        cartService.updateCartItem(user, itemId, request.getQuantity());
        return ResponseEntity.ok("✅ Cart item updated");
    }

    // ✅ DELETE /api/cart/{itemId}
    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long itemId) {
        User user = getCurrentUser();
        cartService.removeFromCart(user, itemId);
        return ResponseEntity.ok("🗑️ Item removed from cart");
    }

    // ✅ DELETE /api/cart/clear
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        User user = getCurrentUser();
        cartService.clearCart(user);
        return ResponseEntity.ok("🧹 Cart cleared");
    }
}
