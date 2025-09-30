# Document Scanner, Converter, and Analyzer

This project provides a full-stack application where users can upload images, have them sharpened automatically by a Python backend script, and then download the processed images to their local devices.


## Features

-Drag & drop or browse to upload images.
-Supports JPEG, JPG, and PNG formats.
-Sharpens images using an OpenCV sharpening kernel.
-Processes images per channel (preserves colors and transparency if present).
-Returns a sharpened version of the image.
-User can view, open full-size, or download the sharpened image.
-Input files are automatically cleaned up after processing.
-Output/input folders are cleared on server shutdown.


## Tech Stack

### Frontend 
React for UI Components and Axios for HTTP requests

### Backend
Node.js + Express + Multer (For file uploads)

### Image Processing
Python + OpenCV + NumPy


## How It Works
1. User uploads an image to the frontend
2. File is sent to the backend
3. Backend stores image in inputs folder
4. Python file takes image from inputs folder and sharpens it
   -Deals with gray or colored images
   -Preserves alpha transparency if present
   -Saves the sharpened image to the outputs folder     
5. Backend returns a link to the sharpened image
6. Front displays sharpened image
7. User can:
    -Preview the sharpened image
    -Open the sharpened image to full size in a new tab
    -Download the sharpened image to their local device


## Instructions On How To Run Application

### 1. Clone the repository
```bash
git clone https://github.com/your-username/image-sharpening-app.git
cd image-sharpening-app
```

### 2. Install dependencies

#### Backend dependencies:
```bash
cd Backend
npm install express multer cors uuid
pip install opencv-python numpy
```

#### Frontend dependencies:
```bash
cd Frontend
npm install @mui/material @emotion/react @emotion/styled axios react
```

### 3. Run the backend server
```bash
cd Backend
node server.js
```

### 4. Run the frontend
```bash
cd Frontend
npm start
```


## Example

### Unsharpened Image
![test_one](https://github.com/user-attachments/assets/65a6666c-ed44-4905-9d36-bf91ebabf994)

### Sharpened Image
![336bbf88-b8b7-48d6-b2df-920937b6b317](https://github.com/user-attachments/assets/7df2ae02-1525-4f50-b3d9-2052c3a10d70)
