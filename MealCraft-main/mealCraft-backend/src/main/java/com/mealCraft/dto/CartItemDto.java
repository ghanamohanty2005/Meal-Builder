package com.mealCraft.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemDto {
    private Long mealId;
    private int quantity;
}
