import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import zoldyckImg from './Zoldyck Family Arc Network.png';
import React, { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [outputImage, setOutputImage] = useState(null);

  const isValidFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return allowedTypes.includes(file.type);
  };

  const handleSetFile = (selectedFile) => {
    setFile(selectedFile);
    setMessage('');
    setOutputImage(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!isValidFileType(selectedFile)) {
        setMessage('Only accepts JPEG, JPG, or PNG files');
        setFile(null);
        setOutputImage(null);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (!isValidFileType(droppedFile)) {
        setMessage('Only accepts JPEG, JPG, or PNG files');
        setFile(null);
        setOutputImage(null);
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
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      if (response.status !== 200 || !response.data.imageUrl) {
        setMessage('Upload failed');
        setOutputImage(null);
        return;
      }
      setOutputImage('http://localhost:5000' + response.data.imageUrl);
      setMessage('Upload successful!');
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      setMessage('Upload failed: ' + (serverMsg || error.message));
      setOutputImage(null);
    } finally {
      setLoading(false);
    }
  };

  async function saveImage(image){
    try{
      //Request the image
      const {data} = await axios.get(image, {responseType: 'blob'});
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.split('/').pop() || 'resolved-image.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
    catch(err){
      setMessage('Save Failed');
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          mt: 5,
          mb: 8,
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
        onDrop={handleDrop}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 10 }}>
          Upload Image or PDF
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 5 }}>
          Drag & Drop files here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 5, mb: 3, color: 'black', backgroundColor: 'lightgray' }}
          component="label"
          disabled={loading}
        >
          Browse
          <input
            type="file"
            hidden
            onChange={(e) => { handleFileChange(e); e.target.value = ''; }}
            accept="image/jpeg,image/jpg,image/png"
          />
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
          disabled={loading || !file}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
        </Button>
        {message && (
          <Typography sx={{ mt: 2, color: message.includes('failed') ? 'error.main' : 'text.primary' }}>
            {message}
          </Typography>
        )}
      </Box>
      {outputImage && (
        <Box
          sx={{
            textAlign: 'center',
            mb: 5,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            Resolved Image
          </Typography>
          <img
            src={outputImage}
            alt="Resolved Image"
            width="75%"
            height="75%"
            style={{ margin: '0 auto' }}
          />
          <Button variant="contained" onClick = {() => saveImage(outputImage)} sx={{ mt: 5, color: 'black', backgroundColor: 'lightblue' }}>
            Download Image
          </Button>
        </Box>
      )}
    </Container>
  );
}