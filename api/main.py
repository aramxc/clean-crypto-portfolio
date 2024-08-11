from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/example-endpoint', methods=['GET'])
def example():
    return jsonify({'message': 'Hello from Flask!'})

if __name__ == '__main__':
    app.run(debug=True)