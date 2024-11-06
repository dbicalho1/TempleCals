package com.templecals.backend;

public class Meal {
    private String name;
    private int calories;
    private String type;

    // Default constructor
    public Meal() {}

    // Constructor with parameters
    public Meal(String name, int calories, String type) {
        this.name = name;
        this.calories = calories;
        this.type = type;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCalories() {
        return calories;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
