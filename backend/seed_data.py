"""
Script to populate the database with Temple University dining hall data
Run this file to add sample data to your database
"""

from app import app
from database import db
from models import DiningHall, MealCategory, Meal
from datetime import time

def seed_database():
    """Add sample Temple University dining data"""
    
    with app.app_context():
        print("Clearing existing data...")
        Meal.query.delete()
        MealCategory.query.delete()
        DiningHall.query.delete()
        
        # Create Dining Halls
        print("Adding dining halls...")
        dining_halls = [
            DiningHall(
                name="Johnson & Hardwick Hall",
                location="1900 N 13th St, Philadelphia, PA 19122",
                description="Temple's main dining hall featuring multiple food stations",
                hours={
                    "monday": {"breakfast": "7:00-10:30", "lunch": "11:00-16:00", "dinner": "17:00-21:00"},
                    "tuesday": {"breakfast": "7:00-10:30", "lunch": "11:00-16:00", "dinner": "17:00-21:00"},
                    "wednesday": {"breakfast": "7:00-10:30", "lunch": "11:00-16:00", "dinner": "17:00-21:00"},
                    "thursday": {"breakfast": "7:00-10:30", "lunch": "11:00-16:00", "dinner": "17:00-21:00"},
                    "friday": {"breakfast": "7:00-10:30", "lunch": "11:00-16:00", "dinner": "17:00-20:00"},
                    "saturday": {"brunch": "10:00-14:00", "dinner": "17:00-20:00"},
                    "sunday": {"brunch": "10:00-14:00", "dinner": "17:00-21:00"}
                }
            ),
            DiningHall(
                name="Morgan's Hall",
                location="1301 Cecil B Moore Ave, Philadelphia, PA 19122",
                description="Convenient dining location in Morgan Hall North",
                hours={
                    "monday": {"breakfast": "7:30-10:00", "lunch": "11:00-15:00", "dinner": "17:00-20:00"},
                    "tuesday": {"breakfast": "7:30-10:00", "lunch": "11:00-15:00", "dinner": "17:00-20:00"},
                    "wednesday": {"breakfast": "7:30-10:00", "lunch": "11:00-15:00", "dinner": "17:00-20:00"},
                    "thursday": {"breakfast": "7:30-10:00", "lunch": "11:00-15:00", "dinner": "17:00-20:00"},
                    "friday": {"breakfast": "7:30-10:00", "lunch": "11:00-15:00", "dinner": "17:00-19:00"},
                    "saturday": {"closed": True},
                    "sunday": {"dinner": "17:00-20:00"}
                }
            ),
            DiningHall(
                name="The Market at Liacouras Walk",
                location="Liacouras Walk, Philadelphia, PA 19122",
                description="Food court style dining with multiple vendors",
                hours={
                    "monday": {"open": "8:00-22:00"},
                    "tuesday": {"open": "8:00-22:00"},
                    "wednesday": {"open": "8:00-22:00"},
                    "thursday": {"open": "8:00-22:00"},
                    "friday": {"open": "8:00-20:00"},
                    "saturday": {"open": "10:00-20:00"},
                    "sunday": {"open": "10:00-22:00"}
                }
            )
        ]
        
        for hall in dining_halls:
            db.session.add(hall)
        
        # Create Meal Categories
        print("Adding meal categories...")
        categories = [
            MealCategory(name="Breakfast", description="Morning meals served until 10:30 AM"),
            MealCategory(name="Lunch", description="Midday meals served 11:00 AM - 4:00 PM"),
            MealCategory(name="Dinner", description="Evening meals served after 5:00 PM"),
            MealCategory(name="Snacks", description="Light snacks and beverages"),
            MealCategory(name="Desserts", description="Sweet treats and desserts")
        ]
        
        for category in categories:
            db.session.add(category)
        
        # Commit to get IDs
        db.session.commit()
        
        # Get the created objects for foreign keys
        jh_hall = DiningHall.query.filter_by(name="Johnson & Hardwick Hall").first()
        morgans_hall = DiningHall.query.filter_by(name="Morgan's Hall").first()
        market_hall = DiningHall.query.filter_by(name="The Market at Liacouras Walk").first()
        
        breakfast_cat = MealCategory.query.filter_by(name="Breakfast").first()
        lunch_cat = MealCategory.query.filter_by(name="Lunch").first()
        dinner_cat = MealCategory.query.filter_by(name="Dinner").first()
        snacks_cat = MealCategory.query.filter_by(name="Snacks").first()
        desserts_cat = MealCategory.query.filter_by(name="Desserts").first()
        
        # Create Sample Meals
        print("Adding sample meals...")
        meals = [
            # Johnson & Hardwick Breakfast
            Meal(
                name="Scrambled Eggs",
                description="Fresh scrambled eggs made to order",
                calories=140,
                protein=12.0,
                carbs=2.0,
                fat=10.0,
                sodium=180.0,
                price=0.0,  # Included in meal plan
                allergens=["eggs"],
                dietary_tags=["vegetarian"],
                available_start=time(7, 0),
                available_end=time(10, 30),
                dining_hall_id=jh_hall.id,
                category_id=breakfast_cat.id
            ),
            Meal(
                name="Pancakes",
                description="Fluffy buttermilk pancakes served with syrup",
                calories=220,
                protein=6.0,
                carbs=28.0,
                fat=8.0,
                sodium=400.0,
                price=0.0,
                allergens=["gluten", "eggs", "dairy"],
                dietary_tags=["vegetarian"],
                available_start=time(7, 0),
                available_end=time(10, 30),
                dining_hall_id=jh_hall.id,
                category_id=breakfast_cat.id
            ),
            
            # Johnson & Hardwick Lunch
            Meal(
                name="Grilled Chicken Breast",
                description="Seasoned grilled chicken breast with herbs",
                calories=185,
                protein=35.0,
                carbs=0.0,
                fat=4.0,
                sodium=75.0,
                price=0.0,
                allergens=[],
                dietary_tags=["gluten-free"],
                available_start=time(11, 0),
                available_end=time(16, 0),
                dining_hall_id=jh_hall.id,
                category_id=lunch_cat.id
            ),
            Meal(
                name="Caesar Salad",
                description="Romaine lettuce with Caesar dressing, croutons, and parmesan",
                calories=170,
                protein=4.0,
                carbs=8.0,
                fat=14.0,
                sodium=350.0,
                price=0.0,
                allergens=["dairy", "gluten"],
                dietary_tags=["vegetarian"],
                available_start=time(11, 0),
                available_end=time(16, 0),
                dining_hall_id=jh_hall.id,
                category_id=lunch_cat.id
            ),
            
            # Johnson & Hardwick Dinner
            Meal(
                name="Beef Stir Fry",
                description="Tender beef with mixed vegetables in savory sauce",
                calories=280,
                protein=22.0,
                carbs=18.0,
                fat=12.0,
                sodium=890.0,
                price=0.0,
                allergens=["soy"],
                dietary_tags=[],
                available_start=time(17, 0),
                available_end=time(21, 0),
                dining_hall_id=jh_hall.id,
                category_id=dinner_cat.id
            ),
            Meal(
                name="Vegetarian Pasta",
                description="Penne pasta with marinara sauce and fresh vegetables",
                calories=320,
                protein=12.0,
                carbs=58.0,
                fat=6.0,
                sodium=480.0,
                price=0.0,
                allergens=["gluten"],
                dietary_tags=["vegetarian", "vegan"],
                available_start=time(17, 0),
                available_end=time(21, 0),
                dining_hall_id=jh_hall.id,
                category_id=dinner_cat.id
            ),
            
            # Morgan's Hall meals
            Meal(
                name="Turkey Sandwich",
                description="Sliced turkey with lettuce, tomato on whole wheat bread",
                calories=290,
                protein=25.0,
                carbs=28.0,
                fat=8.0,
                sodium=720.0,
                price=0.0,
                allergens=["gluten"],
                dietary_tags=[],
                available_start=time(11, 0),
                available_end=time(15, 0),
                dining_hall_id=morgans_hall.id,
                category_id=lunch_cat.id
            ),
            Meal(
                name="Chicken Quesadilla",
                description="Grilled chicken and cheese in a flour tortilla",
                calories=380,
                protein=28.0,
                carbs=32.0,
                fat=16.0,
                sodium=680.0,
                price=0.0,
                allergens=["dairy", "gluten"],
                dietary_tags=[],
                available_start=time(17, 0),
                available_end=time(20, 0),
                dining_hall_id=morgans_hall.id,
                category_id=dinner_cat.id
            ),
            
            # Market snacks and desserts
            Meal(
                name="Fresh Fruit Cup",
                description="Seasonal fresh fruit medley",
                calories=80,
                protein=1.0,
                carbs=20.0,
                fat=0.0,
                sodium=5.0,
                price=3.99,
                allergens=[],
                dietary_tags=["vegan", "gluten-free"],
                available_start=time(8, 0),
                available_end=time(22, 0),
                dining_hall_id=market_hall.id,
                category_id=snacks_cat.id
            ),
            Meal(
                name="Chocolate Chip Cookie",
                description="Freshly baked chocolate chip cookie",
                calories=160,
                protein=2.0,
                carbs=22.0,
                fat=7.0,
                sodium=95.0,
                price=1.99,
                allergens=["gluten", "dairy", "eggs"],
                dietary_tags=["vegetarian"],
                available_start=time(8, 0),
                available_end=time(22, 0),
                dining_hall_id=market_hall.id,
                category_id=desserts_cat.id
            )
        ]
        
        for meal in meals:
            db.session.add(meal)
        
        # Commit all changes
        db.session.commit()
        
        print("✅ Database seeded successfully!")
        print(f"Added {len(dining_halls)} dining halls")
        print(f"Added {len(categories)} meal categories") 
        print(f"Added {len(meals)} meals")

if __name__ == '__main__':
    seed_database()
