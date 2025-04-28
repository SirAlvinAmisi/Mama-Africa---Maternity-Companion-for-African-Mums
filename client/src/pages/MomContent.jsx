import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MomContent() {
  const [content, setContent] = useState({ posts:[], articles:[] });
  useEffect(() => {
    axios
      .get('http://localhost:5000/mums/content', {
        headers:{ Authorization:`Bearer ${localStorage.token}` }
      })
      .then(res => setContent(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Community Posts</h2>
        {content.posts.map((p,i) => (
          <div key={i} className="mb-4 p-4 bg-cards-color rounded">
            <h3 className="font-semibold">{p.title}</h3>
            <p>{p.content}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Approved Articles</h2>
        {content.articles.map((a,i) => (
          <div key={i} className="mb-4 p-4 bg-cards-color rounded">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="italic">{a.category}</p>
            <p>{a.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
