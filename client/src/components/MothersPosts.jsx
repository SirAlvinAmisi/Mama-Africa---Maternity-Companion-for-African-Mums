import React from 'react';


function MothersPost({ posts }) {
  return (
    <div className="mothers-post-card">
      <h2><span className="highlight">Mothers Post</span></h2>
      {posts.map((post, index) => (
        <div className="post" key={index}>
          <h4>{post.author}</h4>
          <p>{post.content}</p>
          <button className="view-button">VIEW</button>
        </div>
      ))}
    </div>
  );
}

export default MothersPost;
