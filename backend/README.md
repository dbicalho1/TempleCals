# TempleCals Backend

A Flask-based REST API for managing Temple University dining hall meal information.

## Features

- **PostgreSQL Database**: Stores dining halls, meal categories, and meal details
- **REST API**: Full CRUD operations for meals and dining halls
- **Real Data**: Pre-populated with Temple University dining locations
- **Filtering**: Search meals by dining hall, category, or name
- **Nutritional Info**: Calories, protein, carbs, fat, sodium for each meal
- **Allergen Support**: Track allergens and dietary restrictions
- **CORS Enabled**: Ready for frontend integration

## Database Schema

### Dining Halls
- Johnson & Hardwick Hall
- Morgan's Hall  
- The Market at Liacouras Walk

### Meal Categories
- Breakfast, Lunch, Dinner, Snacks, Desserts

### Meals
- Name, description, nutritional info
- Allergens and dietary tags
- Availability times
- Associated dining hall and category

## API Endpoints

### Health Check
- `GET /api/health` - Check API and database status

### Dining Halls
- `GET /api/dining-halls` - Get all dining halls
- `GET /api/dining-halls/<id>` - Get specific dining hall

### Meal Categories  
- `GET /api/categories` - Get all meal categories

### Meals
- `GET /api/meals` - Get all available meals
- `GET /api/meals?dining_hall_id=1` - Filter by dining hall
- `GET /api/meals?category_id=2` - Filter by category
- `GET /api/meals?search=chicken` - Search by name
- `GET /api/meals/<id>` - Get specific meal

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Start PostgreSQL**
   ```bash
   brew services start postgresql@14
   ```

3. **Create Database**
   ```bash
   /opt/homebrew/opt/postgresql@14/bin/createdb templecals_db
   ```

4. **Run Migrations**
   ```bash
   export FLASK_APP=app.py
   python3 -m flask db upgrade
   ```

5. **Seed Database**
   ```bash
   python3 seed_data.py
   ```

6. **Start Server**
   ```bash
   python3 app.py
   ```

The API will be available at `http://127.0.0.1:5000`

## Example API Responses

### Get Dining Halls
```json
[
  {
    "id": 1,
    "name": "Johnson & Hardwick Hall",
    "location": "1900 N 13th St, Philadelphia, PA 19122",
    "description": "Temple's main dining hall featuring multiple food stations",
    "hours": {
      "monday": {"breakfast": "7:00-10:30", "lunch": "11:00-16:00", "dinner": "17:00-21:00"}
    }
  }
]
```

### Get Meals
```json
[
  {
    "id": 1,
    "name": "Scrambled Eggs",
    "description": "Fresh scrambled eggs made to order", 
    "calories": 140,
    "protein": 12.0,
    "allergens": ["eggs"],
    "dietary_tags": ["vegetarian"],
    "dining_hall": "Johnson & Hardwick Hall",
    "category": "Breakfast",
    "available_start": "07:00",
    "available_end": "10:30"
  }
]
```

## Next Steps

Your backend is now ready! You can:

1. **Connect your React frontend** - Update your frontend to call these API endpoints instead of using mock data
2. **Add more meals** - Use the database models to add more Temple dining options
3. **Add authentication** - Implement user accounts and favorites
4. **Add meal planning** - Let users save meals to a weekly plan
5. **Add reviews** - Let users rate and review meals

## Files Structure

- `app.py` - Main Flask application with API endpoints
- `models.py` - Database models (DiningHall, MealCategory, Meal)
- `database.py` - Database configuration
- `seed_data.py` - Script to populate database with sample data
- `migrations/` - Database migration files
- `.env` - Database connection settings
- `requirements.txt` - Python dependencies
