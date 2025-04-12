// src/components/common/ImageUpload.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ImageUpload.css';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  type: 'event' | 'profile';
  onUploadStart?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImage, 
  type,
  onUploadStart 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const { getIdToken } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    try {
      setIsUploading(true);
      setUploadError(null);
      if (onUploadStart) onUploadStart();

      const formData = new FormData();
      formData.append('image', file);

      const token = await getIdToken();
      const endpoint = `/api/images/${type === 'event' ? 'events' : 'profile'}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      onImageUploaded(data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
      
      <div className="upload-controls">
        <label className={`upload-button ${isUploading ? 'uploading' : ''}`}>
          {isUploading ? 'Uploading...' : previewUrl ? 'Change Image' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
        </label>
        
        {uploadError && <p className="upload-error">{uploadError}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;