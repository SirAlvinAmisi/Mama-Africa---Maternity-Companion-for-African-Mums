import React from 'react';
import ArticleForm from './ArticleForm';
import ScanUpload from './ScanUpload';

export default function ContentManagement() {
  return (
    <div>
      <h2>Content Management</h2>
      <ArticleForm />
      <ScanUpload />
    </div>
  );
}