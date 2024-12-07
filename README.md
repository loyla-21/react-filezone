# react-filezone

filezone is a robust, flexible React file upload library with advanced features and a seamless user experience.

## Features

- 🚀 Multiple and single file upload modes
- 📂 File type and size validation
- 📊 Upload progress tracking
- 🔄 Concurrent upload support
- 🛡️ Error handling
- 💻 TypeScript support

## Installation

Install the package using npm or yarn:

```bash
npm install react-filezone
# or
yarn add react-filezone
```

## Usage

### Basic Image Upload Component

```typescript
import React from 'react';
import { useUpload } from 'react-filezone';

const ImageUploader: React.FC = () => {
  const {
    acceptedFiles,
    errors,
    getRootProps,
    getInputProps,
    removeFile,
    isDragActive
  } = useUpload({
    action: '/api/upload',
    globalConfig: {
      allowedFileTypes: ['image/*'],
      maxFiles: 5,
      maxFileSize: 5 * 1024 * 1024 // 5MB
    },
    onUploadComplete: (data) => {
      console.log('Upload complete:', data);
    }
  });

  return (
    <div>
      <div 
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <p>Drag and drop images here, or click to select</p>
      </div>
      
      {errors.length > 0 && (
        <div className="error-container">
          {errors.map((error, index) => (
            <p key={index} className="error">{error}</p>
          ))}
        </div>
      )}
      
      <div className="preview-container">
        {acceptedFiles.map((file) => (
          <div key={file.id} className="file-preview">
            {file.previewUrl && (
              <img 
                src={file.previewUrl} 
                alt={file.file.name} 
                className="thumbnail"
              />
            )}
            <div className="file-info">
              <p>{file.file.name}</p>
              <p>Progress: {file.state.progress}%</p>
              <button onClick={() => removeFile(file.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
```

## Video Upload with Strict Configuration

```typescript
import React from 'react';
import { useUpload } from 'react-filezone';

const VideoUploader: React.FC = () => {
  const {
    acceptedFiles,
    errors,
    getRootProps,
    getInputProps,
    removeFile,
    restartUpload,
    isDragActive
  } = useUpload({
    action: '/api/upload-video',
    globalConfig: {
      mode: 'single', // Only one video at a time
      allowedFileTypes: ['video/mp4', 'video/quicktime'],
      maxFileSize: 100 * 1024 * 1024, // 100MB
      maxConcurrentUploads: 1
    },
    metadata: {
      category: 'user-content',
      source: 'web-upload'
    },
    onUploadStart: (files) => {
      console.log('Starting upload for:', files[0].file.name);
    },
    onUploadComplete: (data) => {
      console.log('Video uploaded successfully:', data);
    },
    onError: (error, file) => {
      console.error('Upload failed:', error, file);
    }
  });

  return (
    <div>
      <div 
        {...getRootProps()}
        className={`video-dropzone ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        <p>Drag and drop a video file here, or click to select</p>
      </div>
      
      {errors.map((error, index) => (
        <div key={index} className="error-message">{error}</div>
      ))}
      
      {acceptedFiles.map((file) => (
        <div key={file.id} className="video-preview">
          {file.videoPreviewUrl && (
            <video 
              src={file.videoPreviewUrl} 
              controls 
              className="video-thumbnail"
            />
          )}
          <div className="upload-status">
            <p>{file.file.name}</p>
            <p>Status: {file.state.status}</p>
            <p>Progress: {file.state.progress}%</p>
            {file.state.status === 'error' && (
              <button onClick={() => restartUpload(file.id)}>
                Retry Upload
              </button>
            )}
            <button onClick={() => removeFile(file.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoUploader;

```
## Document Upload with Custom Headers

```typescript
import React from 'react';
import React, { useState } from 'react';
import { useUpload } from 'react-filezone';

const DocumentUploader: React.FC = () => {
  const [userId, setUserId] = useState('');
  const {
    acceptedFiles,
    errors,
    getRootProps,
    getInputProps,
    removeFile,
    isDragActive
  } = useUpload({
    action: '/api/upload-documents',
    headers: {
      'X-User-ID': userId,
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    globalConfig: {
      allowedFileTypes: [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      maxFiles: 3,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    onUploadComplete: (data) => {
      console.log('Documents uploaded successfully:', data);
    }
  });

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      
      <div 
        {...getRootProps()}
        className={`document-dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <p>Drag and drop documents here, or click to select</p>
      </div>
      
      {errors.map((error, index) => (
        <div key={index} className="error">{error}</div>
      ))}
      
      <div className="document-list">
        {acceptedFiles.map((file) => (
          <div key={file.id} className="document-item">
            <p>{file.file.name}</p>
            <p>Size: {(file.file.size / 1024).toFixed(2)} KB</p>
            <p>Upload Progress: {file.state.progress}%</p>
            <button onClick={() => removeFile(file.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUploader;

```
## Multiple File Type Upload

```typescript
import React from 'react';
import { useUpload } from 'react-filezone';

const MultiTypeUploader: React.FC = () => {
  const {
    acceptedFiles,
    errors,
    getRootProps,
    getInputProps,
    removeFile,
    isDragActive
  } = useUpload({
    action: '/api/upload-assets',
    globalConfig: {
      allowedFileTypes: [
        'image/*', 
        'video/mp4', 
        'application/pdf',
        'text/plain'
      ],
      maxFiles: 10,
      maxFileSize: 50 * 1024 * 1024 // 50MB
    },
    onUploadComplete: (data) => {
      console.log('Files uploaded successfully:', data);
    }
  });

  const renderFilePreview = (file: FileState) => {
    if (file.previewUrl && file.file.type.startsWith('image/')) {
      return <img src={file.previewUrl} alt={file.file.name} />;
    }
    if (file.videoPreviewUrl && file.file.type.startsWith('video/')) {
      return <video src={file.videoPreviewUrl} />;
    }
    return <p>{file.file.name}</p>;
  };

  return (
    <div>
      <div 
        {...getRootProps()}
        className={`multi-dropzone ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        <p>Drag and drop multiple file types, or click to select</p>
      </div>
      
      {errors.map((error, index) => (
        <div key={index} className="error">{error}</div>
      ))}
      
      <div className="file-grid">
        {acceptedFiles.map((file) => (
          <div key={file.id} className="file-item">
            {renderFilePreview(file)}
            <div className="file-details">
              <p>{file.file.name}</p>
              <p>Type: {file.file.type}</p>
              <p>Progress: {file.state.progress}%</p>
              <button onClick={() => removeFile(file.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiTypeUploader;

```

## Configuration

### Global Configuration Options

- `mode`: 'single' or 'multiple' (default: 'multiple')
- `maxFiles`: Maximum number of files allowed (default: 3)
- `maxFileSize`: Maximum file size in bytes (default: 10GB)
- `allowedFileTypes`: Array of allowed MIME types (default: ['*/*'])
- `maxConcurrentUploads`: Maximum concurrent uploads (default: 5)

### Hooks and Callbacks

- `onUploadStart`: Triggered when files start uploading
- `onUploadProgress`: Called during upload progress
- `onError`: Called when an upload fails

## API Reference

### `useUpload(options)`

#### Options
- `action`: Upload endpoint URL (required)
- `globalConfig`: Configuration object
- `headers`: Custom headers for upload request
- `metadata`: Additional metadata to attach to files

#### Returns
- `acceptedFiles`: List of processed files
- `errors`: Validation and upload errors
- `getRootProps()`: Props for drag and drop zone
- `getInputProps()`: Props for file input
- `removeFile(fileId)`: Remove a file from upload queue
- `uploadFile(fileId)`: Manually trigger file upload
- `restartUpload(fileId)`: Restart a failed upload

## TypeScript Support

Full TypeScript definitions are included for type safety and IDE support.

## License

MIT License