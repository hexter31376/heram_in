"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

async function fetchPosts() {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await response.json();
  return data;
}

export default function ListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getPosts() {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="list-bg">
      {posts.map((post) => (
        <div className="list-item" key={post._id}>
          <h4>
            <Link href={`/post/${post._id}`}>
              {post.title}
            </Link>
          </h4>
          <p>{post.date}</p>
        </div>
      ))}
    </div>
  );
}
