from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
CORS(app)

VALENTINE_WEEK = {
    "rose-day": {
        "date": "2026-02-07",
        "title": "Rose Day",
        "subtitle": "I am bad at drawing so please bear with my disformed roses.🌹",
        "message": "Here is a virtual rose from my side. (kyuki blinkit nahi aata aapke waha) Happy Rose Day!",
        "color": "#e63946",
        "poems": [
            "Roses are red, violets are blue, no flower in the world is as beautiful as you.",
            "Like petals soft upon the breeze, you calm my heart and put me at ease.",
            "Each rose I give speaks words untold, of love more precious than finest gold."
        ]
    },
    "propose-day": {
        "date": "2026-02-08",
        "title": "Propose Day",
        "subtitle": "Will you be mine? 💍",
        "message": "Coming soon...",
        "color": "#e76f51"
    },
    "chocolate-day": {
        "date": "2026-02-09",
        "title": "Chocolate Day",
        "subtitle": "Life is sweet with you 🍫",
        "message": "Coming soon...",
        "color": "#6b4226"
    },
    "teddy-day": {
        "date": "2026-02-10",
        "title": "Teddy Day",
        "subtitle": "Warm hugs for you 🧸",
        "message": "Coming soon...",
        "color": "#c9a96e"
    },
    "promise-day": {
        "date": "2026-02-11",
        "title": "Promise Day",
        "subtitle": "Forever and always 🤞",
        "message": "Coming soon...",
        "color": "#457b9d"
    },
    "hug-day": {
        "date": "2026-02-12",
        "title": "Hug Day",
        "subtitle": "Wrapped in love 🤗",
        "message": "Coming soon...",
        "color": "#f4a261"
    },
    "kiss-day": {
        "date": "2026-02-13",
        "title": "Kiss Day",
        "subtitle": "A kiss to seal it all 💋",
        "message": "Coming soon...",
        "color": "#e76f8a"
    },
    "valentines-day": {
        "date": "2026-02-14",
        "title": "Valentine's Day",
        "subtitle": "Love conquers all ❤️",
        "message": "Coming soon...",
        "color": "#d62828"
    }
}

@app.route('/api/days', methods=['GET'])
def get_all_days():
    return jsonify(VALENTINE_WEEK)

@app.route('/api/days/<day_slug>', methods=['GET'])
def get_day(day_slug):
    day = VALENTINE_WEEK.get(day_slug)
    if day:
        return jsonify(day)
    return jsonify({"error": "Day not found"}), 404

@app.route('/api/today', methods=['GET'])
def get_today():
    today = datetime.now().strftime("%Y-%m-%d")
    for slug, day in VALENTINE_WEEK.items():
        if day["date"] == today:
            return jsonify({"slug": slug, **day})
    return jsonify({"message": "No special day today", "date": today})

# Serve React app for all non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
