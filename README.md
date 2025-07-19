# StudyPulse - AI Powered Smart Learning Partner

Welcome to StudyPulse, a modern, futuristic web-based educational platform designed to revolutionize learning through AI.

## Project Overview

StudyPulse provides AI-powered personalized learning paths, smart tools for progress tracking, interactive learning experiences (AR/3D), gamified quizzes, and an AI assistant to help students learn efficiently.

## Tech Stack

*   **Frontend:** React.js (Create React App)
    *   Routing: `react-router-dom`
    *   API Calls: `axios`
    *   Charting: `chart.js`, `react-chartjs-2`
    *   Styling: CSS (with CSS Variables for theming)
*   **Backend:** Python (Django)
    *   API Framework: `djangorestframework`
    *   Database: SQLite (default, can be changed in `backend/studypulse_project/settings.py`)
*   **AI Integration:** Gemini API (via backend)

## Project Structure

```
StudyPulse/
├── backend/          # Django Backend Code
│   ├── api/              # Main application logic, models, views, serializers
│   ├── studypulse_project/ # Django project settings
│   ├── media/            # User uploaded files
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # React Frontend Code
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable UI components (Layout, Features, Tools)
│   │   └── pages/        # Page-level components
│   ├── .gitignore
│   └── package.json
└── README.md         # This file
```

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn) installed (for frontend)
*   Python and pip installed (for backend)
*   Git (optional, for cloning)

### Setup

1.  **Clone the repository (optional):**
    ```bash
    git clone <repository-url>
    cd StudyPulse
    ```

2.  **Backend Setup:**
    *   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    *   Create a virtual environment (recommended):
        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows use `venv\Scripts\activate`
        ```
    *   Install dependencies:
        ```bash
        pip install -r requirements.txt
        ```
    *   Apply database migrations:
        ```bash
        python manage.py migrate
        ```
    *   Create a superuser (for accessing Django admin):
        ```bash
        python manage.py createsuperuser
        ```

3.  **Frontend Setup:**
    *   Navigate to the frontend directory:
        ```bash
        cd ../frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        # or: yarn install
        ```

### Running the Application

1.  **Run the Backend Server:**
    *   Make sure you are in the `backend` directory and your virtual environment is activated.
    *   Start the Django development server (usually runs on `http://127.0.0.1:8000/`):
        ```bash
        python manage.py runserver
        ```

2.  **Run the Frontend Server:**
    *   Open a **new terminal**.
    *   Navigate to the `frontend` directory.
    *   Start the React development server (usually runs on `http://localhost:3000/`):
        ```bash
        npm start
        # or: yarn start
        ```

3.  **Access the Application:**
    *   Open your web browser and navigate to `http://localhost:3000/`.

## Next Steps

*   **Backend:**
    *   Define database models in `backend/api/models.py`.
    *   Create corresponding serializers in `backend/api/serializers.py`.
    *   Implement API views and logic in `backend/api/views.py`.
    *   Define API endpoints in `backend/api/urls.py`.
    *   Integrate with the Gemini API for chatbot and other AI features.
    *   Set up authentication (e.g., using Django REST Framework's token authentication or JWT).
    *   Configure CORS if frontend and backend run on different origins (uncomment `corsheaders` in `settings.py` and add frontend origin).
*   **Frontend:**
    *   Replace placeholder components and data with actual implementations.
    *   Implement API calls using `axios` to fetch data from the backend.
    *   Build out the UI for each feature based on the designs.
    *   Implement state management (e.g., React Context, Redux, Zustand) if needed.
    *   Add animations and refine styling.
    *   Implement authentication flow (login/signup forms, storing tokens).
    *   Replace placeholder icons with a suitable icon library (e.g., `react-icons`).
    *   Implement charting using `react-chartjs-2`.
    *   Implement AR/3D model viewing (e.g., using libraries like `@google/model-viewer` or `three.js`).
    *   Implement voice input/output using the Web Speech API. 