package com.mealCraft.repository;

import com.mealCraft.model.CartItem;
import com.mealCraft.model.MealItem;
import com.mealCraft.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 🔁 Get all cart items for a user
    List<CartItem> findByUser(User user);

    // 🔍 Find if a specific meal already exists in the user's cart
    Optional<CartItem> findByUserAndMeal(User user, MealItem meal);

    // 🔍 Find item by ID and user (for ownership verification)
    Optional<CartItem> findByIdAndUser(Long id, User user);
}
