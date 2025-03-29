# TempleCals

TempleCals is a full-stack web application designed to help Temple University students track their daily caloric intake and nutritional information from on-campus food sources.

## Tech Stack

*   **Frontend:** React
*   **Backend:** Flask (Python)
*   **Database:** PostgreSQL (Planned)

## Project Structure

```
TempleCals/
├── backend/
│   ├── app.py           # Main Flask application
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
├── .gitignore
└── README.md
```

## Setup & Running

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the Flask development server:**
    ```bash
    python app.py
    ```
    The backend should now be running on `http://127.0.0.1:5000`.

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
