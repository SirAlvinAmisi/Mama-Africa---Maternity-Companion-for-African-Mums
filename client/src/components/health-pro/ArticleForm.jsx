import React, { useState } from 'react';

export default function ArticleForm() {
  const [title, setTitle] = useState('');

  return (
    <form>
      <input 
        type="text" 
        placeholder="Article Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <button type="submit">Publish</button>
    </form>
  );
}