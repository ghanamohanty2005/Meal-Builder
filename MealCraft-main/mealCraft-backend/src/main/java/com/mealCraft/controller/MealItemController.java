package com.mealCraft.controller;

import com.mealCraft.model.MealItem;
import com.mealCraft.repository.MealItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:3000")
public class MealItemController {

    @Autowired
    private MealItemRepository mealItemRepository;

    // GET all meal items
    @GetMapping
    public List<MealItem> getAllMeals() {
        return mealItemRepository.findAll();
    }

    // GET meals by type (base, protein, veggie, extra)
    @GetMapping("/{type}")
    public List<MealItem> getMealsByType(@PathVariable String type) {
        return mealItemRepository.findByType(type.toLowerCase());
    }

    // POST: Add new meal item (for admin)
    @PostMapping("/add")
    public MealItem addMealItem(@RequestBody MealItem mealItem) {
        return mealItemRepository.save(mealItem);
    }
    
    // DELETE: Delete a meal item by ID
    @DeleteMapping("/{id}")
    public void deleteMealItem(@PathVariable Long id) {
        mealItemRepository.deleteById(id);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<MealItem>> searchMeals(@RequestParam String name) {
        List<MealItem> results = mealItemRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(results);
    }


}
