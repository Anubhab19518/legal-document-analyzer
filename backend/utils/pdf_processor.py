

import fitz  # PyMuPDF
import os

def extract_text_from_pdf(pdf_stream):
    """
    Extracts all text from a given PDF file stream.

    Args:
        pdf_stream: A file-like object (stream) of the PDF file.
                    For example, the object you get from Flask's request.files.

    Returns:
        A single string containing all the text from the PDF,
        or an empty string if an error occurs.
    """
    full_text = ""
    try:
        # FIX: Read the entire stream into a bytes object first.
        # The fitz.open(stream=...) method expects bytes, not the stream object itself.
        pdf_bytes = pdf_stream.read()
        
        # Open the PDF from the bytes in memory
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            # Iterate through each page of the document
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # Extract text from the current page
                page_text = page.get_text("text")
                full_text += page_text + "\n" # Add a newline for separation between pages
        
        return full_text.strip()

    except Exception as e:
        # Handle potential errors, such as a corrupt PDF file
        print(f"Error processing PDF file: {e}")
        return ""

# --- Example Usage (for testing this file directly) ---
# This part will only run when you execute `python pdf_processor.py`
if __name__ == '__main__':
    # NOTE: To test this, you must have a 'presentation/demo_documents' folder
    # and your 'rental_agreement.pdf' file must be placed inside it.
    
    # --- Actual test ---
    # We are now pointing directly to the rental agreement for testing.
    test_pdf_path = "rental_agreement.pdf"
    
    print(f"\n--- Testing PDF Extraction from '{test_pdf_path}' ---")
    
    try:
        # We open the file in binary read mode to get a stream,
        # which is what our function expects.
        with open(test_pdf_path, "rb") as pdf_file_stream:
            extracted_text = extract_text_from_pdf(pdf_file_stream)
        
        if extracted_text:
            print("\nExtraction Successful!")
            print("------------------------")
            print(extracted_text)
            print("------------------------")
        else:
            print("\nExtraction failed. Is the PDF empty or corrupt?")

    except FileNotFoundError:
        print(f"\nError: The test file was not found at '{test_pdf_path}'")
        print("Please make sure your 'rental_agreement.pdf' is in the correct folder.")
    except Exception as e:
        print(f"An error occurred during testing: {e}")
