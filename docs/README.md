# InsightBuddy

InsightBuddy is a lightweight AI teaching assistant starter project. It pairs a vanilla HTML/CSS/JavaScript frontend with a Flask backend that can be extended with real AI APIs later on.

## Features

- Clean, responsive UI with sidebar navigation, mode selector, difficulty dropdown, and chat layout.
- Chat workflow that calls different backend endpoints based on mode (Ask Doubt, Learn Topic, Quiz Mode).
- Flask backend with placeholder AI logic ready for OpenAI/Gemini integration.
- Sample topic and quiz data stored as JSON for quick prototyping.

## Project Structure

```
InsightBuddy/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── backend/
│   ├── app.py
│   ├── ai_service.py
│   ├── config_example.py
│   └── requirements.txt
├── content/
│   ├── sample_topics.json
│   └── sample_quiz.json
└── docs/
    └── README.md
```

## Getting Started

1. **Install backend dependencies**
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure API keys (optional for now)**
   - Copy `config_example.py` to `config.py`.
   - Fill in your provider, model name, and API keys.
   - Update `call_ai_model` in `ai_service.py` with real API calls when ready.

3. **Run the Flask server**
   ```bash
   python app.py
   ```
   The backend runs at `http://localhost:5000`.

4. **Open the frontend**
   - Use a simple HTTP server or Live Server extension to serve the `frontend` folder.
   - Access `index.html` in your browser and start chatting with InsightBuddy.

## Extending the Project

- Hook `call_ai_model` into OpenAI, Gemini, or local LLMs.
- Expand JSON content or move to a database.
- Add voice capture/playback in the frontend (the mic button is ready).
- Build user accounts, progress tracking, or analytics dashboards.

## License

This project is provided as starter scaffolding. Use internally or extend for your own learning platforms.


