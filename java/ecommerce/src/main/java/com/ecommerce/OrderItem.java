package com.ecommerce;

import lombok.Data;

@Data
public class OrderItem {
    private String productId;
    private int quantity;

    // Manually added getters and setters (only needed if Lombok fails)
    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
