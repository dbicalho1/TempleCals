// Meal options and nutritional data
const foodOptions = {
    cafe1: ["Oatmeal", "Bagel", "Pancakes", "Fruit Bowl", "Yogurt Parfait"],
    diner1: ["Eggs and Bacon", "French Toast", "Smoothie", "Muffin", "Cereal"],
    cafe2: ["Salad", "Burger", "Pasta", "Soup", "Sandwich"],
    diner2: ["Pizza", "Chicken Wrap", "Fries", "Caesar Salad", "Burrito"],
    cafe3: ["Steak", "Grilled Veggies", "Rice Bowl", "Sushi", "Tacos"],
    diner3: ["Fish and Chips", "Spaghetti", "Salmon", "Mashed Potatoes", "Lasagna"]
  };
  
  const nutritionalData = {
    "Oatmeal": [150, 3, 27, 5],
    "Bagel": [250, 1, 50, 10],
    "Pancakes": [350, 8, 60, 8],
    "Fruit Bowl": [100, 0, 25, 1],
    "Yogurt Parfait": [200, 5, 30, 8],
    "Eggs and Bacon": [300, 20, 1, 20],
    "French Toast": [400, 15, 60, 10],
    "Smoothie": [150, 2, 35, 5],
    "Muffin": [250, 10, 40, 5],
    "Cereal": [200, 1, 45, 4],
    "Salad": [180, 12, 15, 5],
    "Burger": [500, 25, 40, 30],
    "Pasta": [400, 10, 60, 15],
    "Soup": [150, 5, 20, 5],
    "Sandwich": [300, 10, 30, 20],
    "Pizza": [400, 18, 50, 20],
    "Chicken Wrap": [350, 10, 40, 25],
    "Fries": [300, 15, 45, 4],
    "Caesar Salad": [200, 12, 10, 8],
    "Burrito": [600, 20, 70, 25],
    "Steak": [700, 40, 0, 50],
    "Grilled Veggies": [150, 5, 15, 5],
    "Rice Bowl": [400, 10, 60, 15],
    "Sushi": [300, 5, 55, 10],
    "Tacos": [400, 15, 40, 20],
    "Fish and Chips": [600, 30, 60, 25],
    "Spaghetti": [500, 15, 70, 15],
    "Salmon": [400, 20, 0, 40],
    "Mashed Potatoes": [200, 8, 30, 4],
    "Lasagna": [600, 25, 70, 30]
  };
  
  function updateFoodOptions(mealType, locationId, foodId) {
    const location = document.getElementById(locationId).value;
    const foodSelect = document.getElementById(foodId);
    foodSelect.innerHTML = '<option value="">Choose a food item</option>';
  
    if (foodOptions[location]) {
      foodOptions[location].forEach(food => {
        const option = document.createElement("option");
        option.value = food;
        option.textContent = food;
        foodSelect.appendChild(option);
      });
    }
  }
  
  function displayNutritionalInfo(food) {
    const table = document.getElementById("nutritional-table");
    table.innerHTML = `<tr>
        <th>Calories</th>
        <th>Fats (g)</th>
        <th>Carbs (g)</th>
        <th>Protein (g)</th>
      </tr>`;
  
    if (nutritionalData[food]) {
      const [calories, fats, carbs, protein] = nutritionalData[food];
      const row = document.createElement("tr");
      row.innerHTML = `<td>${calories}</td><td>${fats}</td><td>${carbs}</td><td>${protein}</td>`;
      table.appendChild(row);
    } else {
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan='4'>No data available</td>";
      table.appendChild(row);
    }
  }
  
  // Event listeners to update food options and nutritional data
  document.getElementById("breakfast-location").addEventListener("change", () => {
    updateFoodOptions("Breakfast", "breakfast-location", "breakfast-food");
  });
  document.getElementById("lunch-location").addEventListener("change", () => {
    updateFoodOptions("Lunch", "lunch-location", "lunch-food");
  });
  document.getElementById("dinner-location").addEventListener("change", () => {
    updateFoodOptions("Dinner", "dinner-location", "dinner-food");
  });
  
  document.getElementById("breakfast-food").addEventListener("change", (e) => {
    displayNutritionalInfo(e.target.value);
  });
  document.getElementById("lunch-food").addEventListener("change", (e) => {
    displayNutritionalInfo(e.target.value);
  });
  document.getElementById("dinner-food").addEventListener("change", (e) => {
    displayNutritionalInfo(e.target.value);
  });
  