from flask import Flask, request, jsonify
from oracle_api import transfer_amount

app = Flask(__name__)

@app.route('/transferAmount', methods=['POST'])
def handle_transfer_amount():
    try:
        data = request.get_json()
        name = data.get('name')
        city = data.get('city')

        if not name or not city:
            return jsonify({"error": "Missing 'name' or 'city' in the request body"}), 400

        print(f"Received Request: Name={name}, City={city}")
        result = transfer_amount(name, city)
        print(f"Response Sent: {result}")
        return jsonify(result)

    except Exception as e:
        print(f"Error Occurred: {str(e)}")
        return jsonify({"error": "Failed to process the request"}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
