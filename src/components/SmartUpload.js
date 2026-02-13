import React, { useState, useRef } from 'react';
import axios from 'axios';

const SimpleUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadUrl('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    setUploadUrl('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://printbackend.onrender.com/api/orders/upload', // your backend upload endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fileUrl = response.data.url;
      
      // Create print order after upload
      await axios.post(
        'https://printbackend.onrender.com/api/orders/create',
        { fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUploadUrl(fileUrl);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {uploadUrl && (
        <p className="mt-4 text-green-600">
          File uploaded successfully!{' '}
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-700"
          >
            View File
          </a>
        </p>
      )}
    </div>
  );
};

export default SimpleUpload;

