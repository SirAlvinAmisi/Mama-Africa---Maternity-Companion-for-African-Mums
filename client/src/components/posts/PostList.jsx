// src/components/posts/PostList.jsx
import PostCard from './PostCard';
import QuestionCard from './QuestionCard';

export default function PostList({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        post.is_medical ? (
          <QuestionCard key={`question-${post.id}`} question={post} />
        ) : (
          <PostCard key={`post-${post.id}`} post={post} />
        )
      ))}
    </div>
  );
}