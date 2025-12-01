import json
from pathlib import Path
from typing import Optional, Dict, Any

from flask import Flask, jsonify, request
from flask_cors import CORS

from ai_service import build_prompt, call_ai_model

BASE_DIR = Path(__file__).resolve().parent
CONTENT_DIR = BASE_DIR.parent / "content"

TOPICS_FILE = CONTENT_DIR / "sample_topics.json"
QUIZ_FILE = CONTENT_DIR / "sample_quiz.json"


def load_json(path: Path) -> Any:
  with open(path, "r", encoding="utf-8") as handle:
    return json.load(handle)


topics_data = load_json(TOPICS_FILE)
quiz_data = load_json(QUIZ_FILE)
topics_by_id = {topic["id"]: topic for topic in topics_data}

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health_check():
  """Simple health check route."""
  return jsonify({"status": "ok", "message": "InsightBuddy backend running"})


@app.get("/topics")
def get_topics():
  """Provide a list of available topics."""
  return jsonify(
      [{"id": t["id"], "subject": t["subject"], "title": t["title"]} for t in topics_data]
  )


def extract_request_data() -> Dict[str, Any]:
  """Common helper to parse and validate request data."""
  data = request.get_json(force=True)
  return {
      "message": data.get("message", ""),
      "topicId": data.get("topicId"),
      "level": data.get("level", "easy"),
      "mode": data.get("mode", "ask"),
  }


def fetch_topic(topic_id: Optional[str]) -> Optional[Dict[str, Any]]:
  """Retrieve topic data by id if provided."""
  if not topic_id:
    return None
  return topics_by_id.get(topic_id)


@app.post("/ask")
def ask():
  """Handle general question-and-answer interactions."""
  payload = extract_request_data()
  prompt = build_prompt(
      mode="ask",
      user_message=payload["message"],
      topic_data=None,
      level=payload["level"],
  )
  reply = call_ai_model(prompt)
  return jsonify({"reply": reply})


@app.post("/explain_topic")
def explain_topic():
  """Explain a given topic using stored content plus AI flair."""
  payload = extract_request_data()
  topic = fetch_topic(payload["topicId"])
  if not topic:
    return jsonify({"error": "Topic not found"}), 404

  prompt = build_prompt(
      mode="topic",
      user_message=payload["message"] or "Explain the selected topic.",
      topic_data=topic,
      level=payload["level"],
  )
  reply = call_ai_model(prompt)
  return jsonify({"reply": reply})


@app.post("/quiz")
def quiz():
  """Return quiz questions related to a topic."""
  payload = extract_request_data()
  topic_id = payload["topicId"]
  if not topic_id:
    return jsonify({"error": "topicId is required"}), 400

  questions = [q for q in quiz_data if q["topicId"] == topic_id]
  if not questions:
    return jsonify({"error": "No quiz found for this topic"}), 404

  prompt = build_prompt(
      mode="quiz",
      user_message=payload["message"] or "Give a quiz summary.",
      topic_data=topics_by_id.get(topic_id),
      level=payload["level"],
  )
  reply = call_ai_model(prompt)
  return jsonify({"reply": reply, "quiz": questions})


if __name__ == "__main__":
  app.run(port=5000, debug=True)


