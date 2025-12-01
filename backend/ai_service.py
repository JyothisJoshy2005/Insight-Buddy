import os
import openai
from dotenv import load_dotenv

load_dotenv()  # Load .env file

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_ai_response(user_message):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or gpt-4 if available
        messages=[
            {"role": "system", "content": "You are InsightBuddy, a friendly AI teacher."},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message["content"]

