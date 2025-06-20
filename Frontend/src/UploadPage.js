import React, { useState } from 'react';
import { Container, Typography, Button, Box, Input, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const[highlight, setHighlight] = useState(false);

  const isValidFileType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  return allowedTypes.includes(file.type);
  };

  const handleSetFile = (selectedFile) => {
    setFile(selectedFile);
    setMessage('');
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      //handleSetFile(e.target.files[0]);
      const selectedFile = e.target.files[0];
      if (!isValidFileType(selectedFile)){
        setMessage('Only accepts JPEG, PNG, or PDF files');
        setFile(null);
        return;
      }
      handleSetFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setHighlight(true);
  };

  const handleDragLeave = () => {
    setHighlight(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setHighlight(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0){
      const droppedFile = e.dataTransfer.files[0];
    if (!isValidFileType(droppedFile)) {
      setMessage('Only accepts JPEG, PNG, JPG, or PDF files');
      setFile(null);
      return;
    }
    handleSetFile(droppedFile);
    }
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
        if (error.response && error.response.data && error.response.data.message) {
          if (error.response.data.message === 'Only JPEG, PNG, or PDF files are allowed') {
            setMessage('Upload failed: Only accepts PNG, JPEG, or PDF files');
          }
        } else {
          setMessage('Upload failed: ' + error.message);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          mt: 5,
          textAlign: 'center',
          transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
          backgroundColor: highlight ? 'rgba(25, 118, 210, 0.05)' : 'transparent', 
          cursor: 'pointer',
          border: highlight ? '2px dashed #1976d2' : '2px dashed grey',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <Typography variant="h4" gutterBottom sx={{ mb: 10 }}>
          Upload Image or PDF
        </Typography>
        <Typography variant="h6" gutterBottom sx = {{mb: 5}}>
          Drag & Drop files here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
        <Button variant = 'contained' sx = {{mt: 5, mb: 3, color: 'black', backgroundColor: 'lightgray'}}
          component = 'label' disabled = {loading}>
          Browse
          <input
            type="file"
            hidden 
            onChange={handleFileChange}/>
        </Button>
        {file && (
          <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Selected File: {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mt: 3 }}
          disabled={loading || !file}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
        </Button>
        {message && (
          <Typography sx={{ mt: 2, color: message.includes('failed') ? 'error.main' : 'text.primary' }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
