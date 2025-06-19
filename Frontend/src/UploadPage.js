import React, { useState } from 'react';
import { Container, Typography, Button, Box, Input } from '@mui/material';
import axios from 'axios';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    //Clear any previous messages
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setMessage('Extracting Text...')
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Upload Image or PDF
        </Typography>
        <Input type="file" onChange={handleFileChange} />
        <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }} disabled={loading}>
          Upload
        </Button>
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Container>
  );
}
