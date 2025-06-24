import sys
import os
import shutil

"""
Extracts the text content from a given pdf file and saves
the text as a file in the documents_text folder
"""
def extract_text_from_pdf(pdf_file_path):
    try:        
        if not os.path.exists(pdf_file_path):
            raise FileNotFoundError
        
        #Get the current directory
        current_script_dir = os.path.dirname(os.path.abspath(__file__))
        
        #Get the Backend directory
        backend_dir = os.path.dirname(current_script_dir)
        
        #Get path to uploads_temp directory
        pdf_dir = os.path.join(backend_dir, 'pdf_files')
        
        #Create uploads_temp directory if it doesn't exist
        os.makedirs(pdf_dir, exist_ok=True)

        os.makedirs(pdf_dir, exist_ok=True)

        pdf_filename = os.path.basename(pdf_file_path)
                
        destination_pdf_path = os.path.join(pdf_dir, pdf_filename)
        
        shutil.copy(pdf_file_path, destination_pdf_path)
                                  
        return 0
    
    except shutil.Error as e:
        print(f"Error copying file: {e}")
        return None
    
    except Exception as e:
        print(f'Error saving pdf file: {e}', file = sys.stderr)
        return 1

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: pdf_saver.py", file=sys.stderr)
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = extract_text_from_pdf(image_path)
    sys.exit(result)

            
    