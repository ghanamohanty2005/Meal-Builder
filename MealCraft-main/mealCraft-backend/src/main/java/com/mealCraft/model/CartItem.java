package com.mealCraft.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👤 Reference to the user who owns this cart item
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // Prevents circular reference in JSON serialization
    private User user;

    // 🍽️ Reference to the actual meal item
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "meal_id", nullable = false)
    private MealItem meal;

    // 📦 Quantity of this item in the cart
    @Column(nullable = false)
    private int quantity;

    // === Getters and Setters ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MealItem getMeal() {
        return meal;
    }

    public void setMeal(MealItem meal) {
        this.meal = meal;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // ✅ Helper method for frontend (not persisted)
    @Transient
    public double getTotalPrice() {
        return meal != null ? quantity * meal.getPrice() : 0;
    }
}
