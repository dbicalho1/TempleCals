from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables (like database password)
load_dotenv()

app = Flask(__name__)

# Enable CORS so React frontend can connect to this backend
CORS(app)

# Database configuration - tells Flask where to find our database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/templecals_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database connection
from database import db
db.init_app(app)
migrate = Migrate(app, db)

# Import models after db initialization to avoid circular imports
from models import DiningHall, MealCategory, Meal

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the TempleCals Backend!"})

# API Endpoints for Dining Halls
@app.route('/api/dining-halls', methods=['GET'])
def get_dining_halls():
    """Get all dining halls"""
    dining_halls = DiningHall.query.all()
    return jsonify([{
        'id': hall.id,
        'name': hall.name,
        'location': hall.location,
        'description': hall.description,
        'hours': hall.hours
    } for hall in dining_halls])

@app.route('/api/dining-halls/<int:hall_id>', methods=['GET'])
def get_dining_hall(hall_id):
    """Get a specific dining hall"""
    hall = DiningHall.query.get_or_404(hall_id)
    return jsonify({
        'id': hall.id,
        'name': hall.name,
        'location': hall.location,
        'description': hall.description,
        'hours': hall.hours
    })

# API Endpoints for Meal Categories
@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all meal categories"""
    categories = MealCategory.query.all()
    return jsonify([{
        'id': cat.id,
        'name': cat.name,
        'description': cat.description
    } for cat in categories])

# API Endpoints for Meals
@app.route('/api/meals', methods=['GET'])
def get_meals():
    """Get all meals with optional filtering"""
    # Get query parameters for filtering
    dining_hall_id = request.args.get('dining_hall_id', type=int)
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', '')
    
    # Start with base query
    query = Meal.query
    
    # Apply filters if provided
    if dining_hall_id:
        query = query.filter(Meal.dining_hall_id == dining_hall_id)
    
    if category_id:
        query = query.filter(Meal.category_id == category_id)
    
    if search:
        query = query.filter(Meal.name.ilike(f'%{search}%'))
    
    # Only show available meals
    query = query.filter(Meal.is_available == True)
    
    meals = query.all()
    return jsonify([meal.to_dict() for meal in meals])

@app.route('/api/meals/<int:meal_id>', methods=['GET'])
def get_meal(meal_id):
    """Get a specific meal"""
    meal = Meal.query.get_or_404(meal_id)
    return jsonify(meal.to_dict())

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if the API is running and database is connected"""
    try:
        # Try to query the database
        dining_halls_count = DiningHall.query.count()
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'dining_halls_count': dining_halls_count
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True) # Runs on http://127.0.0.1:5000 by default
