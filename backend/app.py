from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the TempleCals Backend!"})

if __name__ == '__main__':
    app.run(debug=True) # Runs on http://127.0.0.1:5000 by default
