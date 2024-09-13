# /scripts/flask_server.py
from flask import Flask, request, jsonify
from recommendations import recommend

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def get_recommendation():
    data = request.json
    user_content = data.get("userContent", [])

    if not user_content:
        return jsonify({"error": "userContent is required"}), 400

    recommended_items = recommend(user_content)
    return jsonify(recommendations=recommended_items), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
