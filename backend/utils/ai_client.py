# backend/utils/ai_client.py

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class GeminiClient:
    """
    A client to interact with the Google Gemini API, specifically tuned
    for the Saral Kanoon application.
    """
    def __init__(self, model_name="gemini-2.5-flash"):
        """
        Initializes the Gemini client.
        """
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found. Please set it in your .env file.")
        
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(model_name)

    def analyze_document(self, document_text: str) -> dict:
        """
        Analyzes the full text of a legal document and returns a structured JSON.
        """
        # This is a highly-tuned prompt for structured JSON output.
        prompt = f"""
        **Instruction:**
        You are an expert legal assistant named "Saral Kanoon" for an Indian audience. Your task is to analyze the provided legal document text and return a valid JSON object.
        The JSON object must have three keys: "summary", "keyClauses", and "redFlags".

        1.  **summary**: A concise, easy-to-understand summary of the document's main purpose in plain English.
        2.  **keyClauses**: An array of objects, where each object represents one of the 3-5 most important clauses. Each object must have a "title" and a "detail" explaining its impact on the user.
        3.  **redFlags**: An array of objects identifying clauses that are risky, unfair, or unusual. Each object must have a "title" and a "detail" explaining the potential risk. If there are no red flags, return an empty array.

        **Document Text to Analyze:**
        ---
        {document_text}
        ---

        **JSON Response:**
        """
        try:
            response = self.model.generate_content(prompt)
            # Clean the response to ensure it's valid JSON
            cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_response)
        except json.JSONDecodeError:
            print("Error: Failed to decode JSON from AI response.")
            return {"error": "Could not parse the AI's analysis."}
        except Exception as e:
            print(f"Error during analysis: {e}")
            return {"error": "An error occurred during document analysis."}

    def answer_question(self, document_text: str, user_question: str) -> str:
        """
        Answers a user's question based ONLY on the provided document context.
        """
        prompt = f"""
        **Instruction:**
        You are a Q&A assistant for "Saral Kanoon". Answer the user's question based *ONLY* on the provided document text.
        Do not use any external knowledge. If the answer is not in the document, you MUST state: "The answer to that question could not be found in the provided document."

        **Document Text:**
        ---
        {document_text}
        ---

        **User's Question:**
        "{user_question}"

        **Answer:**
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error during Q&A: {e}")
            return "Sorry, an error occurred while answering your question."

# --- Example Usage (for testing) ---
if __name__ == '__main__':
    client = GeminiClient()
    sample_text = "This agreement has a lock-in period of 6 months. If the Tenant vacates before this period, the security deposit shall be forfeited."
    
    print("--- Testing Analysis ---")
    analysis = client.analyze_document(sample_text)
    print(json.dumps(analysis, indent=2))

    print("\n--- Testing Q&A ---")
    question = "What happens if I leave early?"
    answer = client.answer_question(sample_text, question)
    print(f"Q: {question}\nA: {answer}")
