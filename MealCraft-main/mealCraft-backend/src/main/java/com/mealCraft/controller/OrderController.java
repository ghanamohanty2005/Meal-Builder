package com.mealCraft.controller;

import com.mealCraft.model.Order;
import com.mealCraft.model.User;
import com.mealCraft.repository.UserRepository;
import com.mealCraft.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Utility: Get current authenticated user
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔐 Authenticated username: " + auth.getName());
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ POST /api/orders/place
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> payload) {
        User user = getCurrentUser();

        String name = String.valueOf(payload.get("name"));
        String address = String.valueOf(payload.get("address"));
        String paymentMethod = String.valueOf(payload.get("paymentMethod"));

        Order order = orderService.placeOrder(user, name, address, paymentMethod);
        return ResponseEntity.ok(order);
    }

    // ✅ GET /api/orders/history
    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory() {
        User user = getCurrentUser();
        List<Order> orders = orderService.getOrdersByUser(user);
        return ResponseEntity.ok(orders);
    }
}
