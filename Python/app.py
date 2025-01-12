from flask import Flask, request

app = Flask(__name__)

@app.route('/add', methods=['GET'])
def add_numbers():
    # Get the query parameters
    num1 = request.args.get('num1', type=int)
    num2 = request.args.get('num2', type=int)
    
    # Perform addition
    if num1 is None or num2 is None:
        return "Error: Please provide both 'num1' and 'num2' as query parameters.", 400
    
    result = num1 + num2
    return f"The sum is: {result}"

if __name__ == '__main__':
    app.run(debug=True)
