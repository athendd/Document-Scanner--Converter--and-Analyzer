import os
import img2pdf
from PIL import Image
from flask import Flask, request
import sys
from pdf_text_extraction import extract_text_from_pdf
import pytesseract
from util_methods import create_output_file, write_to_file

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

def get_text_from_img(file_path):
    try:
        img = Image.open(file_path)
        
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
                
        text = pytesseract.image_to_string(img)
        
        if text is None:
           return 1
        
        output_path = create_output_file(file_path)
        
        write_to_file(output_path, text)
        
        return 0
    
    except  pytesseract.TesseractNotFoundError:
        print('Tesseract is not installed or in your path', file = sys.stderr)
        return 1
    
    except Exception as e:
        print(f'Error processing image: {e}', file = sys.stderr)
        return 1

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python image_conversion.py", file=sys.stderr)
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = get_text_from_img(image_path)
    
    sys.exit(result)