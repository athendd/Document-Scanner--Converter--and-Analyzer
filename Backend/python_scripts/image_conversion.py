import sys
import os
from PIL import Image
import img2pdf

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
    pdf_dir = os.path.join(backend_dir, 'pdf_dir')

    #Get filename of current file
    base_filename = os.path.splitext(os.path.basename(file_path))[0]
    temp_pdf_filename = f"{base_filename}_{os.urandom(8).hex()}.pdf"
    temp_pdf_path = os.path.join(pdf_dir, temp_pdf_filename)
    
    return temp_pdf_path

def convert_img_to_pdf(file_path):
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError
        
        img = Image.open(file_path)
        img.verify()
    
        #Convert image to PDF file
        pdf = img2pdf.convert(file_path)
        
        temp_pdf_path = create_temporary_pdf_file(file_path)
                
        with open(temp_pdf_path, "wb") as f:
            f.write(pdf)
    
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