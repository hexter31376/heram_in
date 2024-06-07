"use client";

import { useEffect, useState } from 'react';
import PostClient from './PostClient';

export default function PostWrapper({ id, initialPost }) {
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    if (!initialPost) {
      async function fetchData() {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
        setLoading(false);
      }
      fetchData();
    }
  }, [id, initialPost]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return <PostClient post={post} />;
}
