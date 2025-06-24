const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

const { spawn } = require('child_process');

const uploadFolder = path.join(__dirname, 'uploads_temp');
const pdfDir = path.join(__dirname, 'pdf_dir');

function processImage(filePath){
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['C:/Users/thynnea/Downloads/Personal Projects/Document System/Document-Scanner--Converter--and-Analyzer/Backend/python_scripts/image_conversion.py', filePath]);

    python.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code !== 0) return reject(new Error('Image processing failed'));
      resolve();
    });
  });
}

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
}

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/pdf'){
      cb(null, pdfDir);
    }
    else{
      cb(null, uploadFolder);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
                    allowedTypes.test(file.mimetype);
    if (isValid){ 
      return cb(null, true);
    }
    else{
      cb(new Error('Only JPEG, PNG, or PDF files are allowed'));
    }
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  try{
    if (mimeType === 'application/pdf'){
            console.log(`PDF file saved directly to ${filePath}`);
    }
    else if (mimeType.startsWith('image/')){
      await processImage(filePath);
    }
    else{
      return res.status(400).json({message: mimeType});
    }
    res.json({ message: 'File Upload Successful', filename: req.file.filename });
  } catch (err){
    console.error(err);
    if (err.message === 'Only JPEG, PNG, or PDF files are allowed'){
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