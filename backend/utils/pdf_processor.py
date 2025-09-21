

import fitz  # PyMuPDF
import os
import concurrent.futures
from PIL import Image
import io

def optimize_image_bytes(img_data: bytes, max_size: int = 1000) -> bytes:
    """
    Optimize the image for faster processing while maintaining readability.
    """
    img = Image.open(io.BytesIO(img_data))
    
    # Calculate new dimensions while maintaining aspect ratio
    ratio = min(max_size / img.width, max_size / img.height)
    new_size = (int(img.width * ratio), int(img.height * ratio))
    
    # Resize and optimize
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Convert back to bytes
    output = io.BytesIO()
    img.save(output, format='PNG', optimize=True)
    return output.getvalue()

def process_page(args):
    """
    Process a single page with the given parameters.
    """
    page, gemini, scale = args
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale))
    img_data = pix.tobytes("png")
    
    # Optimize image before sending to Gemini
    optimized_data = optimize_image_bytes(img_data)
    
    # Use Gemini Vision to extract text
    return gemini.extract_text_from_image(optimized_data)

def extract_text_from_pdf(pdf_stream):
    """
    Extracts all text from a given PDF file stream.
    If regular text extraction fails, falls back to using Gemini's vision capabilities.

    Args:
        pdf_stream: A file-like object (stream) of the PDF file.
                    For example, the object you get from Flask's request.files.

    Returns:
        A single string containing all the text from the PDF,
        or an empty string if both extraction methods fail.
    """
    from .ai_client import GeminiClient
    
    full_text = ""
    pdf_bytes = pdf_stream.read()
    
    try:
        # Initialize Gemini client once for the entire process
        gemini = GeminiClient()
        print("Initialized Gemini client successfully")
        
        # First attempt: Try regular text extraction
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text("text")
                
                if not page_text.strip():  # If page has no extractable text
                    print(f"Page {page_num + 1} has no extractable text, using vision model")
                    # Get page as image and use Gemini Vision with higher quality
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x scale for better quality
                    img_data = pix.tobytes("png")
                    
                    # Use Gemini Vision to extract text
                    page_text = gemini.extract_text_from_image(img_data)
                    print(f"Vision model extracted {len(page_text.split())} words from page {page_num + 1}")
                else:
                    print(f"Successfully extracted {len(page_text.split())} words from page {page_num + 1}")
                
                full_text += page_text + "\n"
            
            result = full_text.strip()
            if result:
                print("Successfully extracted text from PDF")
                return result
            else:
                raise Exception("No text could be extracted from the document")

    except Exception as primary_error:
        # Handle potential errors and try full document vision analysis
        print(f"Error in primary PDF processing: {primary_error}")
        print("Attempting fallback using vision model for entire document...")
        
        try:
            # Convert entire PDF to images and process with Gemini Vision
            with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
                gemini = GeminiClient()
                for page_num in range(len(doc)):
                    print(f"Processing page {page_num + 1} with vision model")
                    page = doc.load_page(page_num)
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x scale for better quality
                    img_data = pix.tobytes("png")
                    page_text = gemini.extract_text_from_image(img_data)
                    
                    if page_text.strip():
                        print(f"Successfully extracted {len(page_text.split())} words from page {page_num + 1}")
                        full_text += page_text + "\n"
                    else:
                        print(f"Warning: No text extracted from page {page_num + 1}")
                
                result = full_text.strip()
                if result:
                    print("Successfully extracted text using vision model")
                    return result
                else:
                    raise Exception("No text could be extracted from the document using vision model")
                
        except Exception as e:
            print(f"Error in fallback PDF processing: {e}")
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
