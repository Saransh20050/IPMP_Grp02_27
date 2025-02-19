from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["ecommerce_db"]

users = db["users"]
products = db["products"]
orders = db["orders"]

app = Flask(__name__)

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

# Route to delete all empty orders
@app.route('/delete_empty_orders', methods=['DELETE'])
def delete_empty_orders():
    try:
        result = orders.delete_many({"items": {"$size": 0}})
        return jsonify({"message": "Deleted empty orders", "deleted_count": result.deleted_count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
