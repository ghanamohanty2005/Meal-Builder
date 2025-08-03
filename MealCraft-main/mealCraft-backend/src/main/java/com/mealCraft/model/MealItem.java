package com.mealCraft.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.mealCraft.controller.MealItemController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type; // base, protein, veggie, extra

    private double price;

    private int calories;

    private String imageUrl;

    // ✅ Optional: For bidirectional relationship with cart items
    
    @JsonIgnore
    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<CartItem> cartItems;
}
