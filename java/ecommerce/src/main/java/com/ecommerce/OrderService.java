package com.ecommerce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public String placeOrder(String userId, List<OrderItem> items) {
        // 1️⃣ Fetch User
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return "❌ User not found!";
        
        User user = userOpt.get();
        double walletBalance = user.getWalletBalance();
        double totalCost = 0;

        // 2️⃣ Validate Stock & Calculate Total Cost
        for (OrderItem item : items) {
            Optional<Product> productOpt = productRepository.findById(item.getProductId());
            if (productOpt.isEmpty()) return "❌ Product not found!";

            Product product = productOpt.get();
            if (product.getStock() < item.getQuantity()) return "❌ Not enough stock for: " + product.getName();

            totalCost += product.getPrice() * item.getQuantity();
        }

        // 3️⃣ Check Wallet Balance
        if (walletBalance < totalCost) return "❌ Insufficient wallet balance!";

        // 4️⃣ Deduct Wallet Balance
        user.setWalletBalance(walletBalance - totalCost);
        userRepository.save(user);

        // 5️⃣ Reduce Product Stock
        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProductId()).get();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        // 6️⃣ Create & Save Order
        Order order = new Order();
        order.setUserId(userId);
        order.setItems(items);
        order.setTotalPrice(totalCost);
        order.setStatus("pending");

        orderRepository.save(order);
        return "✅ Order placed successfully! Total Cost: " + totalCost;
    }
}
