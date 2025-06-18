import os

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

def write_to_file(file_path, text):
        
    #Write PDF file to new location
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(text)
   