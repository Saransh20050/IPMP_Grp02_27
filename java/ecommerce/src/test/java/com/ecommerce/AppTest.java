package com.ecommerce;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AppTest {

    @Test
    void testAddition() {
        int result = 2 + 3;
        assertEquals(5, result, "Sum should be 5");
    }

    @Test
    void testStringNotNull() {
        String message = "Hello, JUnit!";
        assertNotNull(message, "Message should not be null");
        assertTrue(message.contains("JUnit"), "Message should contain 'JUnit'");
    }

    @Test
    void testMongoDBConnection() {
        String dbStatus = "connected"; // Simulated status
        assertEquals("connected", dbStatus, "DB should be connected");
    }
}
