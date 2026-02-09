from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import json

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
CORS(app)

# SQLite Database Configuration for Teddy Day responses
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'teddy_responses.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Secret codeword for accessing database
DATABASE_CODEWORD = 'pookie'

# Model for Teddy Day / Movie Date responses
class TeddyDayResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_free_for_movie = db.Column(db.String(50), nullable=False)
    movie_date = db.Column(db.String(50), nullable=False)
    movie_choice = db.Column(db.String(200), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'isFreeForMovie': self.is_free_for_movie,
            'movieDate': self.movie_date,
            'movieChoice': self.movie_choice,
            'submittedAt': self.submitted_at.isoformat() if self.submitted_at else None
        }

# Create all database tables
with app.app_context():
    db.create_all()

# File to store movie date responses (keeping for backward compatibility)
MOVIE_DATE_FILE = 'movie_date_responses.json'
CHOCOLATE_RANKING_FILE = 'chocolate_ranking_responses.json'

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
        "message": "Just like chocolate makes everything sweeter, you make my life sweeter!",
        "color": "#6b4226"
    },
    "teddy-day": {
        "date": "2026-02-10",
        "title": "Teddy Day",
        "subtitle": "Warm hugs for you 🧸",
        "message": "Here's a cuddly teddy bear for you! Drag him around and let's plan a movie night together!",
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

# Movie date form submission - saves to SQLite database
@app.route('/api/movie-date', methods=['POST'])
def submit_movie_date():
    try:
        data = request.get_json()
        
        # Create new response in database
        new_response = TeddyDayResponse(
            is_free_for_movie=data.get('isFreeForMovie', ''),
            movie_date=data.get('movieDate', ''),
            movie_choice=data.get('movieChoice', '')
        )
        
        db.session.add(new_response)
        db.session.commit()
        
        # Print to console so you can see it
        print("\n" + "="*50)
        print("🎬 NEW MOVIE DATE RESPONSE! (Saved to Database) 🎬")
        print("="*50)
        print(f"Free for movie: {new_response.is_free_for_movie}")
        print(f"Preferred date: {new_response.movie_date}")
        print(f"Movie choice: {new_response.movie_choice}")
        print(f"Submitted at: {new_response.submitted_at}")
        print("="*50 + "\n")
        
        return jsonify({"success": True, "message": "Response saved to database!"})
    except Exception as e:
        print(f"Error saving movie date response: {e}")
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

# Get all teddy day responses from database - PROTECTED with codeword
# This endpoint is NOT exposed to frontend routes
@app.route('/api/teddy-responses', methods=['GET'])
def get_teddy_responses():
    # Check for codeword authentication - MUST be exact
    codeword = request.args.get('codeword', '').lower()
    
    # Check Origin/Referer to block frontend access
    origin = request.headers.get('Origin', '')
    referer = request.headers.get('Referer', '')
    
    # Block if request comes from the frontend app
    if origin or (referer and any(x in referer for x in ['localhost:5173', 'localhost:4173', '.onrender.com'])):
        return jsonify({
            "error": "Access denied",
            "message": "This endpoint cannot be accessed from the browser"
        }), 403
    
    if codeword != DATABASE_CODEWORD:
        return jsonify({
            "error": "Access denied",
            "message": "Invalid codeword. Use ?codeword=<secret> to access",
            "hint": "Only special people know the codeword 💕"
        }), 403
    
    try:
        responses = TeddyDayResponse.query.order_by(TeddyDayResponse.submitted_at.desc()).all()
        return jsonify([r.to_dict() for r in responses])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all movie date responses (for backward compatibility with JSON file)
@app.route('/api/movie-date/responses', methods=['GET'])
def get_movie_date_responses():
    # Check for name authentication
    name = request.args.get('name', '').lower()
    if name != 'pookie':
        return jsonify({
            "error": "Access denied",
            "message": "What's your name? Add ?name=yourname to the URL",
            "hint": "Only pookie can see this 💕"
        }), 403
    
    try:
        if os.path.exists(MOVIE_DATE_FILE):
            with open(MOVIE_DATE_FILE, 'r') as f:
                responses = json.load(f)
            return jsonify(responses)
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Chocolate ranking submission
@app.route('/api/chocolate-ranking', methods=['POST'])
def submit_chocolate_ranking():
    try:
        data = request.get_json()
        
        # Add timestamp
        response_data = {
            'rankings': data.get('rankings', []),
            'submittedAt': datetime.now().isoformat()
        }
        
        # Load existing responses or create new list
        responses = []
        if os.path.exists(CHOCOLATE_RANKING_FILE):
            with open(CHOCOLATE_RANKING_FILE, 'r') as f:
                responses = json.load(f)
        
        # Add new response
        responses.append(response_data)
        
        # Save to file
        with open(CHOCOLATE_RANKING_FILE, 'w') as f:
            json.dump(responses, f, indent=2)
        
        # Print to console so you can see it
        print("\n" + "="*50)
        print("🍫 NEW CHOCOLATE RANKING RESPONSE! 🍫")
        print("="*50)
        for item in response_data['rankings']:
            print(f"#{item['rank']}: {item['name']}")
        print(f"Submitted at: {response_data['submittedAt']}")
        print("="*50 + "\n")
        
        return jsonify({"success": True, "message": "Rankings saved!"})
    except Exception as e:
        print(f"Error saving chocolate ranking: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# Get all chocolate ranking responses (for you to check)
@app.route('/api/chocolate-ranking/responses', methods=['GET'])
def get_chocolate_ranking_responses():
    # Check for name authentication
    name = request.args.get('name', '').lower()
    if name != 'pookie':
        return jsonify({
            "error": "Access denied",
        }), 403
    
    try:
        if os.path.exists(CHOCOLATE_RANKING_FILE):
            with open(CHOCOLATE_RANKING_FILE, 'r') as f:
                responses = json.load(f)
            return jsonify(responses)
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve React app for all non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
