package com.mealCraft.repository;

import com.mealCraft.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // No custom methods needed for now
}
