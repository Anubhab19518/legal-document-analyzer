# backend/utils/ai_client.py

import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Get the API key from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Please set it in your .env file.")

# Configure the generative AI model with your API key
genai.configure(api_key=GEMINI_API_KEY)

# --- Main AI Client Class ---
class GeminiClient:
    """
    A client to interact with the Google Gemini API.
    """

    def __init__(self, model_name="gemini-2.5-pro"):
        """
        Initializes the Gemini client with a specified model.
        Args:
            model_name (str): The name of the Gemini model to use (default is "gemini-pro").
        """
        self.model = genai.GenerativeModel(model_name)
    
    def generate_response(self, text_to_analyze: str) -> str:
        """
        Sends text to the Gemini model and returns the generated response.
        
        Args:
            text_to_analyze (str): The input text to be sent to the model.
        
        Returns:
            str: The text response from the Gemini model, or an error message.
        """
        try:
            prompt = self._create_prompt(text_to_analyze)
            response = self.model.generate_content(prompt)
            # Access the text from the response object
            return response.text
        except Exception as e:
            print(f"Error communicating with Gemini API: {e}")
            return "An error occurred while processing the request."
            
    def _create_prompt(self, document_text: str) -> str:
        """
        Formats the input text into a specific prompt for the Gemini model.
        
        Args:
            document_text (str): The text extracted from the PDF.
        
        Returns:
            str: The final prompt string.
        """
        # You can customize this prompt based on your application's needs
        # For a legal document, you might ask for a summary, key clauses, etc.
        prompt = (
            "You are a helpful legal assistant. Analyze the following legal document "
            "and provide a concise summary of its key points, obligations, "
            "and any important dates or terms. Use bullet points for clarity.\n\n"
            f"Document Text:\n---\n{document_text}\n---"
        )
        return prompt

# --- Example Usage (for testing this file directly) ---
if __name__ == '__main__':
    # This example assumes you have a .env file with GEMINI_API_KEY=YOUR_API_KEY
    print("--- Testing Gemini Client ---")
    
    # 1. Instantiate the client
    client = GeminiClient()
    
    # 2. Prepare some sample text (you would get this from pdf_processor.py)
    sample_text = (
        "This Rental Agreement is made on August 23, 2025, between Landlord: Jane Doe "
        "and Tenant: John Smith. The property is located at 123 Main St. "
        "The rent is $1,500 per month, payable on the 1st of each month. "
        "The lease term is 12 months, starting September 1, 2025. "
        "A security deposit of $1,500 is required. No pets are allowed."
    )
    
    # 3. Get a response from the model
    print("\nSending sample text to Gemini...")
    response_text = client.generate_response(sample_text)
    
    # 4. Print the response
    print("\nResponse from Gemini:")
    print("----------------------")
    print(response_text)
    print("----------------------")