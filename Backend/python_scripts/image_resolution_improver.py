from PIL import Image
import os
import sys
import io

def get_image(input_path, output_path, threshold = 128):
    try:
        if not os.path.exists(input_path):
            raise FileNotFoundError
        
        with Image.open(input_path) as im:
            im.load()

            grayscale = im.convert('L')
            bw = grayscale.point(lambda x: 255 if x > threshold else 0, mode=None)
            bw = bw.convert('1')
            bw.save(output_path)
        return 0
    except Exception as e:
        print(f'Error obtaining iamge: {e}', file = sys.stderr)
        return 1
    
if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(1)
    
    image_path = sys.argv[1]
    output_path = sys.argv[2]
    result = get_image(image_path, output_path)
    if result == 1:
        sys.exit(1)
    
    sys.exit(result)