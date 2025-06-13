import os
import img2pdf
import PyPDF2
from PIL import Image


def get_images_from_folder(folder_path):
    image_file_endings = ('.png', '.jpg', '.jpeg', '.gif', '.bmp', 
                          '.svg', 'webp', '.tif')
    image_list = []
    for filename in os.listdir(folder_path):
        
        #Check if file is an image
        if filename.lower().endswith(image_file_endings):
            try:
                full_path = os.path.join(folder_path, filename)
                img = Image.open(full_path)
                
                #Verify that it is an image
                img.verify()
                image_list.append(full_path)
            except Exception:
                print(f'Skipping invalid image file: {filename}')
                continue
    
    return image_list

def convert_img_to_pdf(image_list):
    for idx, img in enumerate(image_list):
        with Image.open(img) as image:
            if image.mode == 'RGBA':
                print('Unable to convert image with alpha channel')
                continue
        
            #Convert image to PDF file
            pdf = img2pdf.convert(image.filename)
            #Write PDF file to new location
            with open(f'ImageConverter/PDFs/pdf{idx+1}.pdf', 'wb') as file:
                file.write(pdf)
                
one = get_images_from_folder('C:/Users/thynnea/Downloads/Personal Projects/Document System/Document-Scanner--Converter--and-Analyzer/ImageConverter/Images')
print(one)
convert_img_to_pdf(one)

        