# TempleCals

TempleCals is a full-stack web application designed to help Temple University students track their daily caloric intake and nutritional information from on-campus food sources.

## Tech Stack

*   **Frontend:** React with TypeScript
*   **Backend:** Flask (Python) with SQLAlchemy
*   **Database:** PostgreSQL
*   **API:** RESTful API with CORS support

## Project Structure

```
TempleCals/
├── backend/
│   ├── app.py           # Main Flask application with API endpoints
│   ├── models.py        # Database models (DiningHall, MealCategory, Meal)
│   ├── database.py      # Database configuration
│   ├── seed_data.py     # Script to populate database with Temple dining data
│   ├── migrations/      # Database migration files
│   ├── .env            # Database connection settings
│   ├── requirements.txt # Python dependencies
│   └── README.md       # Backend-specific documentation
├── frontend/           # React TypeScript frontend
├── .gitignore
└── README.md
```

## Setup & Running

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    pip3 install -r requirements.txt
    ```

3.  **Install and start PostgreSQL:**
    ```bash
    # Install PostgreSQL (macOS with Homebrew)
    brew install postgresql@14
    
    # Start PostgreSQL service
    brew services start postgresql@14
    
    # Create database
    /opt/homebrew/opt/postgresql@14/bin/createdb templecals_db
    ```

4.  **Set up database:**
    ```bash
    # Run database migrations
    export FLASK_APP=app.py
    python3 -m flask db upgrade
    
    # Seed database with Temple dining data
    python3 seed_data.py
    ```

5.  **Run the Flask development server:**
    ```bash
    python3 app.py
    ```
    The backend API will be running on `http://127.0.0.1:5000`

### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies (if you haven't already):**
    ```bash
    npm install
    ```
3.  **Run the Vite development server:**
    ```bash
    npm run dev
    ```
    The frontend should now be running, likely on `http://localhost:5173` (check the terminal output for the exact URL).

## Features

### Backend API
- **PostgreSQL Database** with Temple University dining hall data
- **RESTful API** with the following endpoints:
  - `GET /api/health` - API health check
  - `GET /api/dining-halls` - Get all dining halls
  - `GET /api/categories` - Get meal categories (breakfast, lunch, dinner)
  - `GET /api/meals` - Get meals with filtering options
  - `GET /api/meals?dining_hall_id=1` - Filter by dining hall
  - `GET /api/meals?search=chicken` - Search meals by name
- **Real Temple Data** including:
  - Johnson & Hardwick Hall
  - Morgan's Hall
  - The Market at Liacouras Walk
- **Nutritional Information** - Calories, protein, carbs, fat, sodium
- **Allergen Support** - Track allergens and dietary restrictions
- **CORS Enabled** - Ready for frontend integration

### Frontend
- **React with TypeScript** for type safety
- **Modern UI** with responsive design
- **Component-based architecture**
- **Ready for backend integration**

## Development Status

✅ **Backend Complete** - Fully functional Flask API with PostgreSQL database  
🔄 **Frontend Integration** - Ready to connect React frontend to backend API  
📋 **Next Steps** - Replace mock data with real API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes as part of Temple University coursework.
