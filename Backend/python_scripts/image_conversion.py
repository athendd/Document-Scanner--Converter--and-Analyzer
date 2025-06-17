import os
import img2pdf
from PIL import Image
from flask import Flask, request
import sys
from pdf_text_extraction import extract_text_from_pdf

"""
Creates a temporary pdf file to store pdf version of image
while its text is being extract
"""
def create_temporary_pdf_file(file_path):
    #Get the current directory
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    
    #Get the Backend directory
    backend_dir = os.path.dirname(current_script_dir)
    
    #Get path to uploads_temp directory
    temp_pdf_dir = os.path.join(backend_dir, 'uploads_temp')
    
    #Create uploads_temp directory if it doesn't exist
    os.makedirs(temp_pdf_dir, exist_ok=True)
    
    #Get filename of current file
    base_filename = os.path.splitext(os.path.basename(file_path))[0]
    temp_pdf_filename = f"{base_filename}_{os.urandom(8).hex()}.pdf"
    temp_pdf_path = os.path.join(temp_pdf_dir, temp_pdf_filename)
    
    return temp_pdf_path

def convert_img_to_pdf(file_path):
    try:
        img = Image.open(file_path)
        img.verify()
    
        #Convert image to PDF file
        pdf = img2pdf.convert(file_path)
        
        temp_pdf_path = create_temporary_pdf_file(file_path)
        
        with open(temp_pdf_path, "wb") as f:
            f.write(pdf)
            
            
        text_extraction_result = extract_text_from_pdf(temp_pdf_path)
        
        #Clean up the temporary PDF file
        try:
            os.remove(temp_pdf_path)
            print(f"Temporary PDF deleted: {temp_pdf_path}")
        except OSError as e:
            print(f"Error deleting temporary PDF {temp_pdf_path}: {e}", file=sys.stderr)

        return text_extraction_result
    
    except Exception as e:
        print(f'Error processing image: {e}', file = sys.stderr)
        return 1

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python image_conversion.py", file=sys.stderr)
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = convert_img_to_pdf(image_path)
    
    sys.exit(result)