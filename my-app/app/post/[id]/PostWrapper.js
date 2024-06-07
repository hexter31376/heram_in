"use client";

import { useEffect, useState } from 'react';
import PostClient from './PostClient';

export default function PostWrapper({ id }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return <PostClient post={post} />;
}
