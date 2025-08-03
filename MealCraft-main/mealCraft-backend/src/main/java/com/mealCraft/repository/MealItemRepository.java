package com.mealCraft.repository;

import com.mealCraft.model.MealItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MealItemRepository extends JpaRepository<MealItem, Long> {
    List<MealItem> findByType(String type); // optional test
    
    List<MealItem> findByNameContainingIgnoreCase(String query);

}
