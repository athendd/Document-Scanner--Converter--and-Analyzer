import os
import sys
import numpy as np
import cv2

def get_image(input_path, output_path):
    try:
        if not os.path.exists(input_path):
            raise FileNotFoundError
        
        #Convert image to BGR format
        image = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
        if image is None:
            raise ValueError(f"cv2.imread failed for: {input_path}")
        
        resolved_image = sharpen_per_channel(image)

        ext = os.path.splitext(output_path)[1].lower()
        ok = None
        if ext in ('.jpg', '.jpeg'):
            ok = cv2.imwrite(output_path, resolved_image, [int(cv2.IMWRITE_JPEG_QUALITY), 98])
        else:
            ok =cv2.imwrite(output_path, resolved_image)

        if not ok:
            raise IOError(f"cv2.imwrite failed for: {output_path}")

        return 0
    except Exception as e:
        print(f'Error obtaining iamge: {e}', file = sys.stderr)
        return 1
    
def sharpen_per_channel(image):
    #Grayscale
    if image.ndim == 2:
        return _sharpen_gray(image)

    alpha = None
    if image.shape[2] == 4:
        bgr, alpha = image[:, :, :3], image[:, :, 3]
    else:
        bgr = image

    kernel = np.array([[0, -1,  0],
                       [-1, 5, -1],
                       [0, -1,  0]], dtype=np.int16)

    b, g, r = cv2.split(bgr)
    b = cv2.filter2D(b, -1, kernel)
    g = cv2.filter2D(g, -1, kernel)
    r = cv2.filter2D(r, -1, kernel)
    bgr_sharp = cv2.merge([b, g, r])

    if alpha is not None:
        return np.dstack([bgr_sharp, alpha])
    
    return bgr_sharp


def _sharpen_gray(gray):
    kernel = np.array([[0, -1,  0],
                       [-1, 5, -1],
                       [0, -1,  0]], dtype=np.int16)
    
    return cv2.filter2D(gray, ddepth=-1, kernel=kernel)
    
if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(1)
    
    image_path = sys.argv[1]
    output_path = sys.argv[2]
    result = get_image(image_path, output_path)
    if result == 1:
        sys.exit(1)
    
    sys.exit(result)