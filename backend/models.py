from database import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON
import bcrypt

class DiningHall(db.Model):
    """
    Represents a dining location at Temple University
    Like Johnson & Hardwick, Morgan's Hall, etc.
    """
    __tablename__ = 'dining_halls'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    location = db.Column(db.String(200))
    description = db.Column(db.Text)
    hours = db.Column(JSON)  # Store operating hours as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship: One dining hall has many meals
    meals = db.relationship('Meal', backref='dining_hall', lazy=True)
    
    def __repr__(self):
        return f'<DiningHall {self.name}>'

class MealCategory(db.Model):
    """
    Categories like Breakfast, Lunch, Dinner, Snacks, etc.
    """
    __tablename__ = 'meal_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text)
    
    # Relationship: One category has many meals
    meals = db.relationship('Meal', backref='category', lazy=True)
    
    def __repr__(self):
        return f'<MealCategory {self.name}>'

class Meal(db.Model):
    """
    Individual meal items available at dining halls
    """
    __tablename__ = 'meals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    
    # Nutritional information
    calories = db.Column(db.Integer)
    protein = db.Column(db.Float)  # grams
    carbs = db.Column(db.Float)    # grams
    fat = db.Column(db.Float)      # grams
    sodium = db.Column(db.Float)   # mg
    
    # Additional info
    price = db.Column(db.Float)
    allergens = db.Column(JSON)    # Store as list: ["nuts", "dairy", "gluten"]
    dietary_tags = db.Column(JSON) # Store as list: ["vegetarian", "vegan", "halal"]
    
    # Availability
    available_start = db.Column(db.Time)  # What time meal becomes available
    available_end = db.Column(db.Time)    # What time meal stops being available
    is_available = db.Column(db.Boolean, default=True)
    
    # Foreign keys - connects meals to dining halls and categories
    dining_hall_id = db.Column(db.Integer, db.ForeignKey('dining_halls.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('meal_categories.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Meal {self.name} at {self.dining_hall.name if self.dining_hall else "Unknown"}>'
    
    def to_dict(self):
        """Convert meal to dictionary for API responses"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fat': self.fat,
            'sodium': self.sodium,
            'price': self.price,
            'allergens': self.allergens,
            'dietary_tags': self.dietary_tags,
            'available_start': self.available_start.strftime('%H:%M') if self.available_start else None,
            'available_end': self.available_end.strftime('%H:%M') if self.available_end else None,
            'is_available': self.is_available,
            'dining_hall': self.dining_hall.name if self.dining_hall else None,
            'category': self.category.name if self.category else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class User(db.Model):
    """
    User model for authentication
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    
    # User preferences
    daily_calorie_goal = db.Column(db.Integer, default=2000)
    daily_protein_goal = db.Column(db.Float, default=150.0)  # grams
    daily_carb_goal = db.Column(db.Float, default=250.0)     # grams
    daily_fat_goal = db.Column(db.Float, default=65.0)       # grams
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        """Hash password and store it"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches stored hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convert user to dictionary for API responses (excluding password)"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'daily_calorie_goal': self.daily_calorie_goal,
            'daily_protein_goal': self.daily_protein_goal,
            'daily_carb_goal': self.daily_carb_goal,
            'daily_fat_goal': self.daily_fat_goal,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
