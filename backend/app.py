from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

# Load environment variables (like database password)
load_dotenv()

app = Flask(__name__)

# Enable CORS so React frontend can connect to this backend
CORS(app)

# Database configuration - tells Flask where to find our database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/templecals_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'templecals-dev-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize JWT
jwt = JWTManager(app)

# Initialize database connection
from database import db
db.init_app(app)
migrate = Migrate(app, db)

# Import models after db initialization to avoid circular imports
from models import DiningHall, MealCategory, Meal, User

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the TempleCals Backend!"})

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=data['email'].lower(),
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        user.set_password(data['password'])
        
        # Set optional goals if provided
        if 'daily_calorie_goal' in data:
            user.daily_calorie_goal = data['daily_calorie_goal']
        if 'daily_protein_goal' in data:
            user.daily_protein_goal = data['daily_protein_goal']
        if 'daily_carb_goal' in data:
            user.daily_carb_goal = data['daily_carb_goal']
        if 'daily_fat_goal' in data:
            user.daily_fat_goal = data['daily_fat_goal']
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.email)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=data['email'].lower()).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.email)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get user', 'details': str(e)}), 500

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
    app.run(debug=True, port=5001) # Changed from port 5000 to 5001 to avoid AirPlay conflict
