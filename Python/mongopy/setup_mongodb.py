from pymongo import MongoClient

# Step 1: Connect to MongoDB (Make sure MongoDB is running)
client = MongoClient("mongodb://localhost:27017/")  # Change if using cloud DB
db = client["ecommerce_db"]  # Creating the database

# Step 2: Create collections
users = db["users"]
products = db["products"]
orders = db["orders"]

# Step 3: Insert Sample Users
users.insert_many([
    {"name": "Alice", "email": "alice@example.com", "wallet_balance": 5000},
    {"name": "Bob", "email": "bob@example.com", "wallet_balance": 3000}
])

# Step 4: Insert Sample Products
products.insert_many([
    {"name": "Laptop", "price": 800, "stock": 10},
    {"name": "Phone", "price": 500, "stock": 15}
])

# Step 5: Insert a Sample Order
orders.insert_one({
    "userId": users.find_one({"name": "Alice"})["_id"],  # Get Alice's ID
    "items": [{"productId": products.find_one({"name": "Laptop"})["_id"], "quantity": 1}],
    "total_price": 800,
    "status": "pending"
})

print("Database setup completed!")
