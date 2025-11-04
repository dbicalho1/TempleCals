from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
import re
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
from models import DiningHall, MealCategory, Meal, User, UserMeal

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
        
        # Validate password strength
        password = data['password']
        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        if not re.search(r'[A-Z]', password):
            return jsonify({'error': 'Password must contain at least one uppercase letter'}), 400
        if not re.search(r'[a-z]', password):
            return jsonify({'error': 'Password must contain at least one lowercase letter'}), 400
        if not re.search(r'[0-9]', password):
            return jsonify({'error': 'Password must contain at least one number'}), 400
        
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

@app.route('/api/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile and nutrition goals"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update profile information
        if 'age' in data:
            user.age = data['age']
        if 'weight' in data:
            user.weight = data['weight']
        if 'height' in data:
            user.height = data['height']
        if 'gender' in data:
            user.gender = data['gender']
        if 'activity_level' in data:
            user.activity_level = data['activity_level']
        if 'goal' in data:
            user.goal = data['goal']
        
        # If auto_calculate is true, calculate recommended macros
        if data.get('auto_calculate', False):
            recommended = user.calculate_recommended_macros()
            if recommended:
                user.daily_calorie_goal = recommended['calories']
                user.daily_protein_goal = recommended['protein']
                user.daily_carb_goal = recommended['carbs']
                user.daily_fat_goal = recommended['fat']
        else:
            # Allow manual override of nutrition goals
            if 'daily_calorie_goal' in data:
                user.daily_calorie_goal = data['daily_calorie_goal']
            if 'daily_protein_goal' in data:
                user.daily_protein_goal = data['daily_protein_goal']
            if 'daily_carb_goal' in data:
                user.daily_carb_goal = data['daily_carb_goal']
            if 'daily_fat_goal' in data:
                user.daily_fat_goal = data['daily_fat_goal']
        
        db.session.commit()
        
        # Calculate recommended macros to include in response
        recommended_macros = user.calculate_recommended_macros()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict(),
            'recommended_macros': recommended_macros
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile', 'details': str(e)}), 500

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

# User Meal Logging Endpoints
@app.route('/api/user-meals/log', methods=['POST'])
@jwt_required()
def log_meal():
    """Log a meal for the current user"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('meal_id'):
            return jsonify({'error': 'meal_id is required'}), 400
        
        # Check if meal exists
        meal = Meal.query.get(data['meal_id'])
        if not meal:
            return jsonify({'error': 'Meal not found'}), 404
        
        # Create user meal entry
        user_meal = UserMeal(
            user_id=user.id,
            meal_id=data['meal_id'],
            serving_multiplier=data.get('serving_multiplier', 1.0),
            notes=data.get('notes', None)
        )
        
        # If consumed_at is provided, use it; otherwise use current time
        if 'consumed_at' in data:
            user_meal.consumed_at = datetime.fromisoformat(data['consumed_at'])
            user_meal.date_consumed = user_meal.consumed_at.date()
        
        db.session.add(user_meal)
        db.session.commit()
        
        return jsonify({
            'message': 'Meal logged successfully',
            'user_meal': user_meal.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to log meal', 'details': str(e)}), 500

@app.route('/api/user-meals/history', methods=['GET'])
@jwt_required()
def get_meal_history():
    """Get meal history for the current user with optional date filtering"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get query parameters
        date_str = request.args.get('date')
        limit = request.args.get('limit', type=int, default=100)
        
        # Start with base query
        query = UserMeal.query.filter_by(user_id=user.id)
        
        # Filter by date if provided
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                query = query.filter(UserMeal.date_consumed == target_date)
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Order by most recent first
        query = query.order_by(UserMeal.consumed_at.desc())
        
        # Apply limit
        user_meals = query.limit(limit).all()
        
        return jsonify({
            'meals': [um.to_dict() for um in user_meals],
            'count': len(user_meals)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get meal history', 'details': str(e)}), 500

@app.route('/api/user-meals/daily/<date>', methods=['GET'])
@jwt_required()
def get_daily_meals(date):
    """Get all meals for a specific date with daily totals"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Parse date
        try:
            target_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Get all meals for that date
        user_meals = UserMeal.query.filter_by(
            user_id=user.id,
            date_consumed=target_date
        ).order_by(UserMeal.consumed_at.asc()).all()
        
        # Calculate daily totals
        total_calories = sum(um.meal.calories * um.serving_multiplier if um.meal and um.meal.calories else 0 for um in user_meals)
        total_protein = sum(um.meal.protein * um.serving_multiplier if um.meal and um.meal.protein else 0 for um in user_meals)
        total_carbs = sum(um.meal.carbs * um.serving_multiplier if um.meal and um.meal.carbs else 0 for um in user_meals)
        total_fat = sum(um.meal.fat * um.serving_multiplier if um.meal and um.meal.fat else 0 for um in user_meals)
        
        return jsonify({
            'date': date,
            'meals': [um.to_dict() for um in user_meals],
            'count': len(user_meals),
            'totals': {
                'calories': int(total_calories),
                'protein': round(total_protein, 1),
                'carbs': round(total_carbs, 1),
                'fat': round(total_fat, 1)
            },
            'goals': {
                'calories': user.daily_calorie_goal,
                'protein': user.daily_protein_goal,
                'carbs': user.daily_carb_goal,
                'fat': user.daily_fat_goal
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get daily meals', 'details': str(e)}), 500

@app.route('/api/user-meals/<int:user_meal_id>', methods=['DELETE'])
@jwt_required()
def delete_user_meal(user_meal_id):
    """Delete a logged meal"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Find the user meal
        user_meal = UserMeal.query.get(user_meal_id)
        
        if not user_meal:
            return jsonify({'error': 'Meal entry not found'}), 404
        
        # Verify it belongs to the current user
        if user_meal.user_id != user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        db.session.delete(user_meal)
        db.session.commit()
        
        return jsonify({'message': 'Meal deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete meal', 'details': str(e)}), 500

@app.route('/api/user-meals/<int:user_meal_id>', methods=['PUT'])
@jwt_required()
def update_user_meal(user_meal_id):
    """Update a logged meal"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Find the user meal
        user_meal = UserMeal.query.get(user_meal_id)
        
        if not user_meal:
            return jsonify({'error': 'Meal entry not found'}), 404
        
        # Verify it belongs to the current user
        if user_meal.user_id != user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Update fields if provided
        if 'serving_multiplier' in data:
            user_meal.serving_multiplier = data['serving_multiplier']
        if 'notes' in data:
            user_meal.notes = data['notes']
        if 'consumed_at' in data:
            user_meal.consumed_at = datetime.fromisoformat(data['consumed_at'])
            user_meal.date_consumed = user_meal.consumed_at.date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Meal updated successfully',
            'user_meal': user_meal.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update meal', 'details': str(e)}), 500

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
