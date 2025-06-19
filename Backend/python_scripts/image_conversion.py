import os
from PIL import Image
from flask import Flask, request
import sys
import pytesseract
from util_methods import create_output_file, write_to_file

"""
Extracts text from a given image and saves the text 
to the documents_text folder
"""
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