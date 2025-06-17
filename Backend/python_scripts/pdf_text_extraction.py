import os
import pdfplumber
import sys

"""
Takes in path of current pdf file and returns
the output path for pdf file's text
"""
def create_output_file(file_path):
    #Get file name of current file
    file_name = os.path.splitext(os.path.basename(file_path))[0]
    
    #Get directory of the current script
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    
    #Go to the Backend directory
    backend_dir = os.path.dirname(current_script_dir)
    
    #Construct the path to the documents_text directory
    document_text_dir = os.path.join(backend_dir, 'documents_text')
    
    #Make the documents_text directory if it doesn't exist
    os.makedirs(document_text_dir, exist_ok=True)
    
    new_txt_filename = f"{file_name}.txt"
    output_path = os.path.join(document_text_dir, new_txt_filename)
    
    return output_path

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
                        
        #Write PDF file to new location
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(all_text)
            
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

            
    