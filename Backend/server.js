const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

const { spawn } = require('child_process');

function processPDF(filePath){
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['C:/Users/thynnea/Downloads/Personal Projects/Document System/Document-Scanner--Converter--and-Analyzer/Backend/python_scripts/pdf_text_extraction.py', filePath]);

    python.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code !== 0) return reject(new Error('PDF processing failed'));
      resolve();
    });
  });
}

//Using temporary uplaods folder to store pdf
const uploadFolder = path.join(__dirname, 'uploads_temp'); 

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

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
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
    if (isValid) return cb(null, true);
    cb(new Error('Only JPEG, PNG, or PDF files are allowed.'));
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  try{
    if (mimeType === 'application/pdf'){
      await processPDF(filePath);
    }
    else if (mimeType.startsWith('image/')){
      await processImage(filePath);
    }
    else{
      return res.status(400).json({message: mimeType});
    }
    res.json({ message: 'File Text Extraction Successful', filename: req.file.filename });
  } catch (err){
    console.error(err);
    res.status(500).json({message: 'Error Extracting Text from File'})
  } finally {
      fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
              console.error(`Error deleting temporary file ${filePath}:`, unlinkErr);
          } else {
              console.log(`Temporary file ${filePath} deleted.`);
          }
      });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});