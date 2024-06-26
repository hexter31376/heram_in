"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import styles from './PostClient.module.css';

const Viewer = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Viewer), { ssr: false });

function PostClient({ post }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const shouldReload = searchParams.get('reload') !== 'true';

  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
      if (shouldReload) {
        router.replace(`${window.location.pathname}?reload=true`, undefined, { shallow: true });
      }
    }
  }, [shouldReload, isClient, router]);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Post deleted successfully');
        router.push('/list?refresh=true');
      } else {
        alert('Failed to delete post');
      }
    }
  };

  const handleEdit = () => {
    router.push(`/post/edit/${post._id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.viewer}>
        {isClient && <Viewer initialValue={post.content} />}
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleEdit} className={styles.button}>Edit</button>
        <button onClick={handleDelete} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
      </div>
    </div>
  );
}

export default function PostClientWrapper({ post }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostClient post={post} />
    </Suspense>
  );
}
