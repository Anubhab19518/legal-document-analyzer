# saral_kanoon/backend/app.py

import os
from flask import Flask, request, jsonify
from utils.pdf_processor import extract_text_from_pdf
from utils.ai_client import GeminiClient

# Initialize the Flask application
app = Flask(__name__)

# --- API Endpoints ---

@app.route('/upload', methods=['POST'])
def upload_pdf_and_get_summary():
    """
    Receives a PDF file, extracts its text, and sends it to the Gemini API
    to get a summary or analysis.
    
    This endpoint is for testing and demonstration purposes.
    """
    # Check if a file was included in the request
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    pdf_file = request.files['pdf_file']
    
    # Check if the file is empty
    if pdf_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    # Process the file if it exists and is a PDF
    if pdf_file and pdf_file.filename.endswith('.pdf'):
        try:
            # 1. Extract text from the PDF using your pdf_processor.py
            print("Extracting text from PDF...")
            extracted_text = extract_text_from_pdf(pdf_file)
            
            if not extracted_text.strip():
                return jsonify({"error": "Could not extract text from the PDF. The file may be empty or encrypted."}), 400

            # 2. Get a response from the Gemini API using your ai_client.py
            print("Sending extracted text to Gemini API...")
            client = GeminiClient()
            gemini_response = client.generate_response(extracted_text)
            
            # 3. Return the AI's response as a JSON object
            return jsonify({"success": True, "gemini_response": gemini_response})

        except Exception as e:
            # Catch any unexpected errors during the process
            print(f"An unexpected error occurred: {e}")
            return jsonify({"error": f"An internal server error occurred: {e}"}), 500
    
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

# --- Main entry point to run the server ---
if __name__ == '__main__':
    # To run this, you can use `python app.py` from your terminal
    # The debug=True option will automatically reload the server on code changes
    print("Starting Flask server...")
    app.run(debug=True, port=5000)

