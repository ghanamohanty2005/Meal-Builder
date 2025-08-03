package com.mealCraft.service;

import com.mealCraft.model.*;
import com.mealCraft.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Order placeOrder(User user, String customerName, String deliveryAddress, String paymentMethod) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Cannot place order.");
        }

        // Calculate total amount
        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getMeal().getPrice() * item.getQuantity())
                .sum();

        // Create new order
        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(customerName);
        order.setDeliveryAddress(deliveryAddress);
        order.setPaymentMethod(paymentMethod);
        order.setTotalAmount(totalAmount + 40); // ₹40 delivery charge
        order.setStatus("Delivering in 1 hour");
        order.setOrderTime(LocalDateTime.now());

        // Create OrderItems
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setMeal(cartItem.getMeal());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);
            return orderItem;
        }).collect(Collectors.toList());

        // Associate items with order
        order.setItems(orderItems);

        // Save order and orderItems
        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        // Clear user's cart
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }
}
