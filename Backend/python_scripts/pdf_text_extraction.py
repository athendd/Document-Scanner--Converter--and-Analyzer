import os
import pdfplumber
import sys
from util_methods import create_output_file, write_to_file

def extract_text_from_pdf(pdf_file_path):
    try:
        all_text = ''
        with pdfplumber.open(pdf_file_path) as pdf:
            for page in pdf.pages:
                page_text= page.extract_text()
                if page_text:
                    all_text += page_text + '\n'
                    
        if all_text == '':
            raise Exception('No text in PDF file')
                
        output_path = create_output_file(pdf_file_path)
                        
        write_to_file(output_path, all_text)
            
        return 0
    
    except Exception as e:
        print(f'Error processing text from pdf file: {e}', file = sys.stderr)
        return 1

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: pdf_text_extraction.py", file=sys.stderr)
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = extract_text_from_pdf(image_path)
    sys.exit(result)

            
    