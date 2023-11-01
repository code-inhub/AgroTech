import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function CustomDropzone(props) {
  const { acceptedFiles, dropzoneText, onSelectFile } = props;

  const onDrop = useCallback(acceptedFiles => {
    // Handle the selected files here
    if (onSelectFile) {
      onSelectFile(acceptedFiles);
    }
  }, [onSelectFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles.join(','),
  });

  return (
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>{dropzoneText}</p>
      )}
    </div>
  );
}

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border .24s ease-in-out',
};

export default CustomDropzone;
