const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Define Schemas
const userSchema = new mongoose.Schema({
    name: String,
    wallet: { type: Number, default: 5000 }
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number
    }],
    total_price: Number,
    status: { type: String, default: "pending" }
});

// Define Models
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Order = mongoose.model("Order", orderSchema);

// ✅ GET ORDER BY ID (Fixing Your Error)
app.get("/orders/:orderId", async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("items.productId");
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ REMOVE A PRODUCT FROM AN ORDER
app.delete("/orders/:orderId/product/:productId", async (req, res) => {
    try {
        const { orderId, productId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const productIndex = order.items.findIndex(item => item.productId.toString() === productId);
        if (productIndex === -1) return res.status(404).json({ message: "Product not found in order" });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found in database" });

        const user = await User.findById(order.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Restore stock & refund wallet
        const removedItem = order.items[productIndex];
        const refundAmount = removedItem.quantity * product.price;

        product.stock += removedItem.quantity;
        user.wallet += refundAmount;

        await product.save();
        await user.save();

        // Remove the product from order
        order.items.splice(productIndex, 1);
        order.total_price -= refundAmount;

        // If order is now empty, mark as cancelled
        if (order.items.length === 0) {
            order.status = "cancelled";
        }

        await order.save();

        res.json({ message: "Product removed from order", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ SERVER LISTEN
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
