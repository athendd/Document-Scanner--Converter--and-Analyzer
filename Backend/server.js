const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const uniqueId = uuidv4();

const app = express();
const port = 5000;

const { spawn } = require('child_process');

const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const inputDir = path.join(__dirname, 'inputs');
if (!fs.existsSync(inputDir)) fs.mkdirSync(inputDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, inputDir); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

app.use(cors());
app.use('/outputs', express.static(outputDir));

function generateUniqueFileName(filePath) {
  const fileExtension = path.extname(filePath);
  return `${uuidv4()}${fileExtension}`;
}

const upload = multer({
  storage,
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

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const inputFilePath = req.file.path;
  const outputFilename = generateUniqueFileName(inputFilePath);
  const outputFilePath = path.join(outputDir, outputFilename);
  const scriptPath = path.join(__dirname, 'python_scripts', 'image_resolution_improver.py');

  const python = spawn('python', [scriptPath, inputFilePath, outputFilePath], { windowsHide: true });

  let responded = false;
  let stderrBuf = '';

  python.stdout.on('data', d => console.log('[py stdout]', d.toString()));
  python.stderr.on('data', d => { stderrBuf += d.toString(); console.error('[py stderr]', d.toString()); });

  python.on('error', (err) => {
    if (responded) return;
    responded = true;
    return res.status(500).json({ message: 'Python process error', detail: String(err) });
  });

  python.on('close', (code) => {
    if (responded) return;
    responded = true;
    if (code !== 0) {
      return res.status(500).json({ message: 'Image processing failed', detail: stderrBuf.trim() });
    }
    res.json({ imageUrl: `/outputs/${outputFilename}` });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
