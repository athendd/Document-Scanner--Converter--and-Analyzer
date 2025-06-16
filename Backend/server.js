const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

//Create pdfs folder if it doesn't exist
const uploadFolder = path.join(__dirname, 'pdfs');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

app.use(cors());
app.use('/pdfs', express.static(uploadFolder));

//Multer storage config
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

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
