const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

const { spawn } = require('child_process');

function processImage(filePath){
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['C:/Users/thynnea/Downloads/Personal Projects/Document System/Document-Scanner--Converter--and-Analyzer/Backend/python_scripts/image_resolution_improver.py', filePath]);

    python.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code !== 0) return reject(new Error('Image processing failed'));
      resolve();
    });
  });
}

app.use(cors());

const upload = multer({
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png'];
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, or PNG files are allowed'));
    }
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  try{
    if (mimeType.startsWith('image/')){
      await processImage(filePath);
    }
    else{
      return res.status(400).json({message: mimeType});
    }
    res.json({ message: 'File Upload Successful', filename: req.file.filename });
  } catch (err){
    console.error(err);
    if (err.message === 'Only JPEG, JPG, or PNG files are allowed'){
      return res.status(400).json({message: err.message});
    }
    res.status(500).json({message: 'Error Uploading File'})
  } finally {
      if (mimeType !== 'application/pdf') {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting temporary file ${filePath}:`, unlinkErr);
          } else {
            console.log(`Temporary file ${filePath} deleted.`);
          }
        });
      } else {
        console.log(`PDF file retained at ${filePath}`);
      }
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});