import React from 'react';

export default function ScanUpload() {
  return (
    <div>
      <h3>Upload Scan Samples</h3>
      <input type="file" accept="image/*" />
    </div>
  );
}